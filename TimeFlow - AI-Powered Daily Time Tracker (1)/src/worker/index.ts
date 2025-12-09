import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import {
  CreateActivitySchema,
  UpdateActivitySchema,
  type Activity,
  type DayAnalytics,
} from "@/shared/types";
import z from "zod";

const app = new Hono<{ Bindings: Env }>();

// ==================== AUTH ENDPOINTS ====================

app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// ==================== ACTIVITY ENDPOINTS ====================

// Get activities for a specific date
app.get(
  "/api/activities/:date",
  authMiddleware,
  zValidator(
    "param",
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  ),
  async (c) => {
    const user = c.get("user")!;
    const { date } = c.req.valid("param");

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY created_at DESC"
    )
      .bind(user.id, date)
      .all();

    return c.json(results as Activity[]);
  }
);

// Create a new activity
app.post(
  "/api/activities",
  authMiddleware,
  zValidator("json", CreateActivitySchema),
  async (c) => {
    const user = c.get("user")!;
    const body = c.req.valid("json");

    const result = await c.env.DB.prepare(
      "INSERT INTO activities (user_id, activity_name, category, duration_minutes, activity_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
    )
      .bind(
        user.id,
        body.activity_name,
        body.category,
        body.duration_minutes,
        body.activity_date
      )
      .run();

    if (!result.success) {
      return c.json({ error: "Failed to create activity" }, 500);
    }

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ?"
    )
      .bind(result.meta.last_row_id)
      .all();

    return c.json(results[0] as Activity, 201);
  }
);

// Update an activity
app.put(
  "/api/activities/:id",
  authMiddleware,
  zValidator("param", z.object({ id: z.string() })),
  zValidator("json", UpdateActivitySchema),
  async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    // Check if activity exists and belongs to user
    const { results: existing } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ? AND user_id = ?"
    )
      .bind(id, user.id)
      .all();

    if (existing.length === 0) {
      return c.json({ error: "Activity not found" }, 404);
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (body.activity_name !== undefined) {
      updates.push("activity_name = ?");
      values.push(body.activity_name);
    }
    if (body.category !== undefined) {
      updates.push("category = ?");
      values.push(body.category);
    }
    if (body.duration_minutes !== undefined) {
      updates.push("duration_minutes = ?");
      values.push(body.duration_minutes);
    }
    if (body.activity_date !== undefined) {
      updates.push("activity_date = ?");
      values.push(body.activity_date);
    }

    if (updates.length === 0) {
      return c.json(existing[0] as Activity);
    }

    updates.push("updated_at = datetime('now')");
    values.push(id, user.id);

    await c.env.DB.prepare(
      `UPDATE activities SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`
    )
      .bind(...values)
      .run();

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ?"
    )
      .bind(id)
      .all();

    return c.json(results[0] as Activity);
  }
);

// Delete an activity
app.delete(
  "/api/activities/:id",
  authMiddleware,
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.valid("param");

    const result = await c.env.DB.prepare(
      "DELETE FROM activities WHERE id = ? AND user_id = ?"
    )
      .bind(id, user.id)
      .run();

    if (!result.success) {
      return c.json({ error: "Failed to delete activity" }, 500);
    }

    return c.json({ success: true });
  }
);

// Get analytics for a specific date
app.get(
  "/api/analytics/:date",
  authMiddleware,
  zValidator(
    "param",
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  ),
  async (c) => {
    const user = c.get("user")!;
    const { date } = c.req.valid("param");

    // Get all activities for the date
    const { results: activities } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY created_at DESC"
    )
      .bind(user.id, date)
      .all();

    if (activities.length === 0) {
      return c.json(null);
    }

    // Calculate totals
    const total_minutes = activities.reduce(
      (sum: number, a: any) => sum + a.duration_minutes,
      0
    );

    // Group by category
    const categoryMap = new Map<
      string,
      { total_minutes: number; activity_count: number }
    >();

    activities.forEach((a: any) => {
      const existing = categoryMap.get(a.category) || {
        total_minutes: 0,
        activity_count: 0,
      };
      categoryMap.set(a.category, {
        total_minutes: existing.total_minutes + a.duration_minutes,
        activity_count: existing.activity_count + 1,
      });
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([category, data]) => ({
        category,
        ...data,
      })
    );

    const analytics: DayAnalytics = {
      total_minutes,
      activity_count: activities.length,
      categories,
      activities: activities as Activity[],
    };

    return c.json(analytics);
  }
);

export default app;
