import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { RemixServer, useSubmit, Form as Form$1, Link, Meta, Links, Outlet, ScrollRestoration, Scripts, useLoaderData, useNavigate, useSearchParams, useFetcher } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { memo, useRef, useMemo, createContext, useState, useCallback, useContext, useEffect, createElement, cloneElement, Fragment as Fragment$1, Component, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useUser, SignedIn, UserButton, SignedOut, ClerkApp, SignIn, SignUp, UserProfile } from "@clerk/remix";
import { rootAuthLoader, getAuth } from "@clerk/remix/ssr.server";
import pg from "pg";
import { Webhook } from "svix";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { LineChart, ArrowUpRight, ArrowDownRight, TrendingUp, FileDown, X as X$6, Settings, ArrowUp, Share2, DollarSign } from "lucide-react";
import { StyleSheet, View, Text, Svg, Line, Document, Page, pdf } from "@react-pdf/renderer";
import ReactPDFChart from "react-pdf-charts";
import c$3 from "prop-types";
import { useSpring, animated, config, useTransition, to } from "@react-spring/web";
import m$7 from "lodash/merge.js";
import y$2 from "lodash/get.js";
import v$8 from "lodash/set.js";
import O$6 from "lodash/isString.js";
import W$5 from "lodash/last.js";
import "lodash/isArray.js";
import Qe from "lodash/isFunction.js";
import Ze from "lodash/without.js";
import je from "lodash/isPlainObject.js";
import Tr from "lodash/pick.js";
import Mr from "lodash/isEqual.js";
import { InternMap } from "internmap";
import { useFormContext, FormProvider, Controller, useForm } from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";
import n$1 from "lodash/uniq.js";
import t$1 from "lodash/uniqBy.js";
import r$1 from "lodash/sortBy.js";
import a$1 from "lodash/isDate.js";
import A$5 from "lodash/uniqueId.js";
import Delaunator from "delaunator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as z$6 } from "zod";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "@radix-ui/react-icons";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { motion } from "framer-motion";
import NumberFlow, { useCanAnimate } from "@number-flow/react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function cn$4(...inputs) {
  return twMerge(clsx(inputs));
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn$4(
          "flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
function Header() {
  const submit = useSubmit();
  const { isLoaded } = useUser();
  const handleSubmit = (e3) => {
    e3.preventDefault();
    const formData = new FormData(e3.currentTarget);
    submit(formData, { method: "get", action: "/etf" });
  };
  return /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between p-4 bg-gray-800 text-white", children: [
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsx("a", { href: "/overview", className: "text-2xl font-bold", children: "Chrono" }),
      /* @__PURE__ */ jsx(Form$1, { onSubmit: handleSubmit, children: /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          name: "ticker",
          placeholder: "Search",
          className: "dark:border-neutral-500"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsx("a", { href: "/compound", className: "text-white", children: "Calculator" }),
      /* @__PURE__ */ jsx("a", { href: "/overview", className: "text-white", children: "Overview" }),
      /* @__PURE__ */ jsx("a", { href: "/portfolio", className: "text-white", children: "Portfolio" }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: !isLoaded ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-8 bg-gray-700 rounded animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-8 bg-gray-700 rounded animate-pulse" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SignedIn, { children: /* @__PURE__ */ jsx(
          UserButton,
          {
            userProfileMode: "navigation",
            userProfileUrl: "/profile"
          }
        ) }),
        /* @__PURE__ */ jsxs(SignedOut, { children: [
          /* @__PURE__ */ jsx(Link, { to: "/sign-in", className: "text-white", children: "Login" }),
          /* @__PURE__ */ jsx(Link, { to: "/sign-up", className: "text-white", children: "Sign Up" })
        ] })
      ] }) })
    ] })
  ] });
}
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
const loader$9 = (args) => rootAuthLoader(args, {
  secretKey: void 0
});
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const PUBLISHABLE_KEY = "pk_test_Z3Jvd24tYm9hci0yOS5jbGVyay5hY2NvdW50cy5kZXYk";
const root = ClerkApp(App, {
  publishableKey: PUBLISHABLE_KEY,
  signInFallbackRedirectUrl: "/",
  signUpFallbackRedirectUrl: "/"
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root,
  links,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
let pool = new pg.Pool();
if (process.env.NODE_ENV === "production") {
  pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432")
  });
} else {
  if (!global.__db__) {
    global.__db__ = new pg.Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432")
    });
  }
  pool = global.__db__;
}
async function createUser(userId, firstName, lastName, email) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO users (user_id, first_name, last_name, email)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email
      RETURNING *;
    `;
    const result = await client.query(query, [
      userId,
      firstName,
      lastName,
      email
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    client.release();
  }
}
async function getUser(userId) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM users
      WHERE user_id = $1;
    `;
    const result = await client.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  } finally {
    client.release();
  }
}
async function getPortfolioHoldings(userId) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        ph.ticker,
        ph.total_shares,
        ph.average_cost,
        ph.last_updated,
        ecp.last_price as current_price,
        ei.name,
        (ph.total_shares * ecp.last_price) as total_value,
        (ph.total_shares * ecp.last_price) - (ph.total_shares * ph.average_cost) as total_gain_loss,
        ((ecp.last_price - ph.average_cost) / ph.average_cost * 100) as gain_loss_percentage
      FROM portfolio_holdings ph
      JOIN etf_info ei ON ph.ticker = ei.ticker
      JOIN etf_cache_price ecp ON ph.ticker = ecp.ticker
      WHERE ph.user_id = $1 AND ph.total_shares > 0
      ORDER BY total_value DESC;
    `;
    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching portfolio holdings:", error);
    throw error;
  } finally {
    client.release();
  }
}
async function getPortfolioSummary(userId) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        SUM(ph.total_shares * ecp.last_price) as total_portfolio_value,
        SUM((ph.total_shares * ecp.last_price) - (ph.total_shares * ph.average_cost)) as total_gain_loss,
        CASE 
          WHEN SUM(ph.total_shares * ph.average_cost) > 0 
          THEN (SUM((ph.total_shares * ecp.last_price) - (ph.total_shares * ph.average_cost)) / 
                SUM(ph.total_shares * ph.average_cost)) * 100
          ELSE 0 
        END as total_gain_loss_percentage
      FROM portfolio_holdings ph
      JOIN etf_cache_price ecp ON ph.ticker = ecp.ticker
      WHERE ph.user_id = $1 AND ph.total_shares > 0;
    `;
    const result = await client.query(query, [userId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    throw error;
  } finally {
    client.release();
  }
}
const generateReportData = async (userId) => {
  const [user, holdings, summary] = await Promise.all([
    getUser(userId),
    getPortfolioHoldings(userId),
    getPortfolioSummary(userId)
  ]);
  return {
    userName: `${user == null ? void 0 : user.first_name} ${user == null ? void 0 : user.last_name}` || "User",
    reportDate: (/* @__PURE__ */ new Date()).toISOString(),
    portfolioSummary: {
      totalValue: summary.total_portfolio_value,
      totalGainLoss: summary.total_gain_loss,
      totalGainLossPercentage: summary.total_gain_loss_percentage,
      numberOfHoldings: holdings.length
    },
    holdings: holdings.map((holding) => ({
      symbol: holding.ticker,
      name: holding.name,
      shares: Number(holding.total_shares),
      averageCost: holding.average_cost,
      currentPrice: holding.current_price,
      totalValue: holding.total_value,
      gainLoss: holding.total_gain_loss,
      gainLossPercentage: Number(holding.gain_loss_percentage)
    })),
    performanceMetrics: {
      // These could be fetched from another service if available
      dailyReturn: 0.5,
      weeklyReturn: 1.2,
      monthlyReturn: 2.8,
      yearlyReturn: 12.5,
      volatility: 15.3,
      sharpeRatio: 1.8
    }
  };
};
const loader$8 = async (args) => {
  const { userId: currentUser } = await getAuth(args);
  const { userId } = args.params;
  if (!currentUser || currentUser !== userId) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const reportData = await generateReportData(userId);
    return json(reportData);
  } catch (error) {
    console.error("Error generating report data:", error);
    return json({ message: "Error generating report" }, { status: 500 });
  }
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const loader$7 = async () => {
  return new Response("Webhook endpoint is working", { status: 200 });
};
const action$1 = async ({ request }) => {
  var _a, _b;
  console.log("Received webhook:", {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries())
  });
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const WEBHOOK_SECRET = (_a = process.env.VITE_CLERK_WEBHOOK_SECRET) == null ? void 0 : _a.trim();
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }
  const svix_id = request.headers.get("svix-id") ?? "";
  const svix_timestamp = request.headers.get("svix-timestamp") ?? "";
  const svix_signature = request.headers.get("svix-signature") ?? "";
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return json({ message: "Error occurred -- no svix headers" }, 400);
  }
  try {
    const rawBody = await request.text();
    const payloadHeaders = {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    };
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(rawBody, payloadHeaders);
    const { type } = evt;
    const eventData = evt.data;
    switch (type) {
      case "user.created":
        if ("email_addresses" in eventData && Array.isArray(eventData.email_addresses)) {
          await createUser(
            eventData.id,
            eventData.first_name || "",
            eventData.last_name || "",
            ((_b = eventData.email_addresses[0]) == null ? void 0 : _b.email_address) || ""
          );
          console.log("User created successfully:", eventData.id);
        }
        break;
      default:
        console.log("Unhandled webhook type:", type);
    }
    return json({ message: "Webhook processed successfully" }, 200);
  } catch (error) {
    console.error("Webhook verification error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return json(
      {
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      400
    );
  }
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const loader$6 = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return json({ message: "Unauthorized" }, 401);
  }
  if (userId !== args.params.userId) {
    return json({ message: "Forbidden" }, 403);
  }
  const user = await getUser(userId);
  return json({ user });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
async function createTransaction(details) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const transactionQuery = `
      INSERT INTO transactions 
        (user_id, ticker, type, shares, price_per_share, total_amount, commission)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const transactionResult = await client.query(transactionQuery, [
      details.userId,
      details.ticker,
      details.type,
      details.shares,
      details.pricePerShare,
      details.totalAmount,
      details.commission || 0
    ]);
    const holdingQuery = `
      INSERT INTO portfolio_holdings 
        (user_id, ticker, total_shares, average_cost)
      VALUES 
        ($1, $2, $3, $4)
      ON CONFLICT (user_id, ticker) 
      DO UPDATE SET
        total_shares = CASE
          WHEN portfolio_holdings.total_shares = 0 
          THEN EXCLUDED.total_shares
          ELSE portfolio_holdings.total_shares + EXCLUDED.total_shares
        END,
        average_cost = CASE
          WHEN portfolio_holdings.total_shares = 0 
          THEN EXCLUDED.average_cost
          ELSE (portfolio_holdings.average_cost * portfolio_holdings.total_shares + $4 * $3) 
               / (portfolio_holdings.total_shares + $3)
        END,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const holdingResult = await client.query(holdingQuery, [
      details.userId,
      details.ticker,
      details.shares,
      details.pricePerShare
    ]);
    await client.query("COMMIT");
    return {
      transaction: transactionResult.rows[0],
      holding: holdingResult.rows[0]
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}
const action = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await args.request.formData();
    const transaction = await createTransaction({
      userId,
      ticker: formData.get("ticker"),
      type: formData.get("type"),
      shares: Number(formData.get("shares")),
      pricePerShare: Number(formData.get("pricePerShare")),
      totalAmount: Number(formData.get("totalAmount"))
    });
    return json({ success: true, transaction });
  } catch (error) {
    console.error("Transaction error:", error);
    return json({ error: "Failed to process transaction" }, { status: 500 });
  }
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        destructive: "bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        outline: "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        secondary: "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn$4(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn$4(
      "rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn$4("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn$4("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn$4("text-sm text-neutral-500 dark:text-neutral-400", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn$4("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn$4("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn$4("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn$4("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn$4("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn$4(
      "border-t bg-neutral-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-neutral-800/50",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn$4(
      "border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:hover:bg-neutral-800/50 dark:data-[state=selected]:bg-neutral-800",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn$4(
      "h-10 px-2 text-left align-middle font-medium text-neutral-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-neutral-400",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn$4(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn$4("mt-4 text-sm text-neutral-500 dark:text-neutral-400", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
function formatPrice(price) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numericPrice)) {
    return "0.00";
  }
  return numericPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
const formatCurrency = (value) => {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};
const parseCurrencyInput = (value) => {
  const sanitized = value.replace(/[^0-9.-]/g, "");
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return sanitized;
};
const formatPercentage = (value) => {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};
const parsePercentageInput = (value) => {
  const sanitized = value.replace(/[^0-9.-]/g, "");
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return sanitized;
};
function v$7() {
  return v$7 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var o2 = arguments[i2];
      for (var n2 in o2) Object.prototype.hasOwnProperty.call(o2, n2) && (t2[n2] = o2[n2]);
    }
    return t2;
  }, v$7.apply(this, arguments);
}
var x$7 = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 }, m$6 = function(t2, i2) {
  return "translate(" + t2 + "px, " + i2 + "px)";
}, b$8 = memo(function(t2) {
  var o2, n2 = t2.position, r2 = t2.anchor, e3 = t2.children, l2 = zt$2(), d = Ur$2(), y2 = d.animate, f2 = d.config, b2 = kt$2(), g2 = b2[0], w2 = b2[1], T2 = useRef(false), C2 = void 0, E2 = false, P2 = w2.width > 0 && w2.height > 0, j2 = Math.round(n2[0]), N2 = Math.round(n2[1]);
  P2 && ("top" === r2 ? (j2 -= w2.width / 2, N2 -= w2.height + 14) : "right" === r2 ? (j2 += 14, N2 -= w2.height / 2) : "bottom" === r2 ? (j2 -= w2.width / 2, N2 += 14) : "left" === r2 ? (j2 -= w2.width + 14, N2 -= w2.height / 2) : "center" === r2 && (j2 -= w2.width / 2, N2 -= w2.height / 2), C2 = { transform: m$6(j2, N2) }, T2.current || (E2 = true), T2.current = [j2, N2]);
  var O2 = useSpring({ to: C2, config: f2, immediate: !y2 || E2 }), V2 = v$7({}, x$7, l2.tooltip.wrapper, { transform: null != (o2 = O2.transform) ? o2 : m$6(j2, N2), opacity: O2.transform ? 1 : 0 });
  return jsx(animated.div, { ref: g2, style: V2, children: e3 });
});
b$8.displayName = "TooltipWrapper";
var g$4 = memo(function(t2) {
  var i2 = t2.size, o2 = void 0 === i2 ? 12 : i2, n2 = t2.color, r2 = t2.style;
  return jsx("span", { style: v$7({ display: "block", width: o2, height: o2, background: n2 }, void 0 === r2 ? {} : r2) });
}), w$6 = memo(function(t2) {
  var i2, o2 = t2.id, n2 = t2.value, r2 = t2.format, e3 = t2.enableChip, l2 = void 0 !== e3 && e3, a2 = t2.color, c2 = t2.renderContent, h = zt$2(), u2 = Ot$2(r2);
  if ("function" == typeof c2) i2 = c2();
  else {
    var f2 = n2;
    void 0 !== u2 && void 0 !== f2 && (f2 = u2(f2)), i2 = jsxs("div", { style: h.tooltip.basic, children: [l2 && jsx(g$4, { color: a2, style: h.tooltip.chip }), void 0 !== f2 ? jsxs("span", { children: [o2, ": ", jsx("strong", { children: "" + f2 })] }) : o2] });
  }
  return jsx("div", { style: h.tooltip.container, children: i2 });
}), T$8 = { width: "100%", borderCollapse: "collapse" }, C$8 = memo(function(t2) {
  var i2, o2 = t2.title, n2 = t2.rows, r2 = void 0 === n2 ? [] : n2, e3 = t2.renderContent, l2 = zt$2();
  return r2.length ? (i2 = "function" == typeof e3 ? e3() : jsxs("div", { children: [o2 && o2, jsx("table", { style: v$7({}, T$8, l2.tooltip.table), children: jsx("tbody", { children: r2.map(function(t3, i3) {
    return jsx("tr", { children: t3.map(function(t4, i4) {
      return jsx("td", { style: l2.tooltip.tableCell, children: t4 }, i4);
    }) }, i3);
  }) }) })] }), jsx("div", { style: l2.tooltip.container, children: i2 })) : null;
});
C$8.displayName = "TableTooltip";
var E$9 = memo(function(t2) {
  var i2 = t2.x0, n2 = t2.x1, r2 = t2.y0, e3 = t2.y1, l2 = zt$2(), u2 = Ur$2(), d = u2.animate, y2 = u2.config, f2 = useMemo(function() {
    return v$7({}, l2.crosshair.line, { pointerEvents: "none" });
  }, [l2.crosshair.line]), x2 = useSpring({ x1: i2, x2: n2, y1: r2, y2: e3, config: y2, immediate: !d });
  return jsx(animated.line, v$7({}, x2, { fill: "none", style: f2 }));
});
E$9.displayName = "CrosshairLine";
var P$7 = memo(function(t2) {
  var i2, o2, n2 = t2.width, r2 = t2.height, e3 = t2.type, l2 = t2.x, a2 = t2.y;
  return "cross" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: r2 }, o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }) : "top-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "top" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: a2 } : "top-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "right" === e3 ? o2 = { x0: l2, x1: n2, y0: a2, y1: a2 } : "bottom-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "bottom" === e3 ? i2 = { x0: l2, x1: l2, y0: a2, y1: r2 } : "bottom-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "left" === e3 ? o2 = { x0: 0, x1: l2, y0: a2, y1: a2 } : "x" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: r2 } : "y" === e3 && (o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }), jsxs(Fragment, { children: [i2 && jsx(E$9, { x0: i2.x0, x1: i2.x1, y0: i2.y0, y1: i2.y1 }), o2 && jsx(E$9, { x0: o2.x0, x1: o2.x1, y0: o2.y0, y1: o2.y1 })] });
});
P$7.displayName = "Crosshair";
var j$7 = createContext({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} }), N$7 = { isVisible: false, position: [null, null], content: null, anchor: null }, O$5 = createContext(N$7), V$1 = function(t2) {
  var i2 = useState(N$7), n2 = i2[0], l2 = i2[1], a2 = useCallback(function(t3, i3, o2) {
    var n3 = i3[0], r2 = i3[1];
    void 0 === o2 && (o2 = "top"), l2({ isVisible: true, position: [n3, r2], anchor: o2, content: t3 });
  }, [l2]), c2 = useCallback(function(i3, o2, n3) {
    void 0 === n3 && (n3 = "top");
    var r2 = t2.current.getBoundingClientRect(), e3 = t2.current.offsetWidth, a3 = e3 === r2.width ? 1 : e3 / r2.width, c3 = "touches" in o2 ? o2.touches[0] : o2, s2 = c3.clientX, h = c3.clientY, u2 = (s2 - r2.left) * a3, d = (h - r2.top) * a3;
    "left" !== n3 && "right" !== n3 || (n3 = u2 < r2.width / 2 ? "right" : "left"), l2({ isVisible: true, position: [u2, d], anchor: n3, content: i3 });
  }, [t2, l2]), s = useCallback(function() {
    l2(N$7);
  }, [l2]);
  return { actions: useMemo(function() {
    return { showTooltipAt: a2, showTooltipFromEvent: c2, hideTooltip: s };
  }, [a2, c2, s]), state: n2 };
}, k$6 = function() {
  var t2 = useContext(j$7);
  if (void 0 === t2) throw new Error("useTooltip must be used within a TooltipProvider");
  return t2;
}, z$5 = function() {
  var t2 = useContext(O$5);
  if (void 0 === t2) throw new Error("useTooltipState must be used within a TooltipProvider");
  return t2;
}, A$4 = function(t2) {
  return t2.isVisible;
}, F$2 = function() {
  var t2 = z$5();
  return A$4(t2) ? jsx(b$8, { position: t2.position, anchor: t2.anchor, children: t2.content }) : null;
}, M$2 = function(t2) {
  var i2 = t2.container, o2 = t2.children, n2 = V$1(i2), r2 = n2.actions, e3 = n2.state;
  return jsx(j$7.Provider, { value: r2, children: jsx(O$5.Provider, { value: e3, children: o2 }) });
};
function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format2) {
  var m2, l2;
  format2 = (format2 + "").trim().toLowerCase();
  return (m2 = reHex.exec(format2)) ? (l2 = m2[1].length, m2 = parseInt(m2[1], 16), l2 === 6 ? rgbn(m2) : l2 === 3 ? new Rgb(m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, (m2 & 15) << 4 | m2 & 15, 1) : l2 === 8 ? rgba(m2 >> 24 & 255, m2 >> 16 & 255, m2 >> 8 & 255, (m2 & 255) / 255) : l2 === 4 ? rgba(m2 >> 12 & 15 | m2 >> 8 & 240, m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, ((m2 & 15) << 4 | m2 & 15) / 255) : null) : (m2 = reRgbInteger.exec(format2)) ? new Rgb(m2[1], m2[2], m2[3], 1) : (m2 = reRgbPercent.exec(format2)) ? new Rgb(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, 1) : (m2 = reRgbaInteger.exec(format2)) ? rgba(m2[1], m2[2], m2[3], m2[4]) : (m2 = reRgbaPercent.exec(format2)) ? rgba(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, m2[4]) : (m2 = reHslPercent.exec(format2)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, 1) : (m2 = reHslaPercent.exec(format2)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, m2[4]) : named.hasOwnProperty(format2) ? rgbn(named[format2]) : format2 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n2) {
  return new Rgb(n2 >> 16 & 255, n2 >> 8 & 255, n2 & 255, 1);
}
function rgba(r2, g2, b2, a2) {
  if (a2 <= 0) r2 = g2 = b2 = NaN;
  return new Rgb(r2, g2, b2, a2);
}
function rgbConvert(o2) {
  if (!(o2 instanceof Color)) o2 = color(o2);
  if (!o2) return new Rgb();
  o2 = o2.rgb();
  return new Rgb(o2.r, o2.g, o2.b, o2.opacity);
}
function rgb$1(r2, g2, b2, opacity) {
  return arguments.length === 1 ? rgbConvert(r2) : new Rgb(r2, g2, b2, opacity == null ? 1 : opacity);
}
function Rgb(r2, g2, b2, opacity) {
  this.r = +r2;
  this.g = +g2;
  this.b = +b2;
  this.opacity = +opacity;
}
define(Rgb, rgb$1, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Rgb(this.r * k2, this.g * k2, this.b * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Rgb(this.r * k2, this.g * k2, this.b * k2, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a2 = clampa(this.opacity);
  return `${a2 === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a2 === 1 ? ")" : `, ${a2})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l2, a2) {
  if (a2 <= 0) h = s = l2 = NaN;
  else if (l2 <= 0 || l2 >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l2, a2);
}
function hslConvert(o2) {
  if (o2 instanceof Hsl) return new Hsl(o2.h, o2.s, o2.l, o2.opacity);
  if (!(o2 instanceof Color)) o2 = color(o2);
  if (!o2) return new Hsl();
  if (o2 instanceof Hsl) return o2;
  o2 = o2.rgb();
  var r2 = o2.r / 255, g2 = o2.g / 255, b2 = o2.b / 255, min2 = Math.min(r2, g2, b2), max2 = Math.max(r2, g2, b2), h = NaN, s = max2 - min2, l2 = (max2 + min2) / 2;
  if (s) {
    if (r2 === max2) h = (g2 - b2) / s + (g2 < b2) * 6;
    else if (g2 === max2) h = (b2 - r2) / s + 2;
    else h = (r2 - g2) / s + 4;
    s /= l2 < 0.5 ? max2 + min2 : 2 - max2 - min2;
    h *= 60;
  } else {
    s = l2 > 0 && l2 < 1 ? 0 : h;
  }
  return new Hsl(h, s, l2, o2.opacity);
}
function hsl(h, s, l2, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l2, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l2, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l2;
  this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Hsl(this.h, this.s, this.l * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Hsl(this.h, this.s, this.l * k2, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l2 = this.l, m2 = l2 + (l2 < 0.5 ? l2 : 1 - l2) * s, m1 = 2 * l2 - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a2 = clampa(this.opacity);
    return `${a2 === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a2 === 1 ? ")" : `, ${a2})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
const radians = Math.PI / 180;
const degrees = 180 / Math.PI;
var A$3 = -0.14861, B$3 = 1.78277, C$7 = -0.29227, D$2 = -0.90649, E$8 = 1.97294, ED = E$8 * D$2, EB = E$8 * B$3, BC_DA = B$3 * C$7 - D$2 * A$3;
function cubehelixConvert(o2) {
  if (o2 instanceof Cubehelix) return new Cubehelix(o2.h, o2.s, o2.l, o2.opacity);
  if (!(o2 instanceof Rgb)) o2 = rgbConvert(o2);
  var r2 = o2.r / 255, g2 = o2.g / 255, b2 = o2.b / 255, l2 = (BC_DA * b2 + ED * r2 - EB * g2) / (BC_DA + ED - EB), bl = b2 - l2, k2 = (E$8 * (g2 - l2) - C$7 * bl) / D$2, s = Math.sqrt(k2 * k2 + bl * bl) / (E$8 * l2 * (1 - l2)), h = s ? Math.atan2(k2, bl) * degrees - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l2, o2.opacity);
}
function cubehelix$1(h, s, l2, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l2, opacity == null ? 1 : opacity);
}
function Cubehelix(h, s, l2, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l2;
  this.opacity = +opacity;
}
define(Cubehelix, cubehelix$1, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Cubehelix(this.h, this.s, this.l * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Cubehelix(this.h, this.s, this.l * k2, this.opacity);
  },
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians, l2 = +this.l, a2 = isNaN(this.s) ? 0 : this.s * l2 * (1 - l2), cosh = Math.cos(h), sinh = Math.sin(h);
    return new Rgb(
      255 * (l2 + a2 * (A$3 * cosh + B$3 * sinh)),
      255 * (l2 + a2 * (C$7 * cosh + D$2 * sinh)),
      255 * (l2 + a2 * (E$8 * cosh)),
      this.opacity
    );
  }
}));
function basis(t12, v0, v1, v2, v3) {
  var t2 = t12 * t12, t3 = t2 * t12;
  return ((1 - 3 * t12 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t12 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis$1(values) {
  var n2 = values.length - 1;
  return function(t2) {
    var i2 = t2 <= 0 ? t2 = 0 : t2 >= 1 ? (t2 = 1, n2 - 1) : Math.floor(t2 * n2), v1 = values[i2], v2 = values[i2 + 1], v0 = i2 > 0 ? values[i2 - 1] : 2 * v1 - v2, v3 = i2 < n2 - 1 ? values[i2 + 2] : 2 * v2 - v1;
    return basis((t2 - i2 / n2) * n2, v0, v1, v2, v3);
  };
}
const constant$1 = (x2) => () => x2;
function linear$1(a2, d) {
  return function(t2) {
    return a2 + t2 * d;
  };
}
function exponential(a2, b2, y2) {
  return a2 = Math.pow(a2, y2), b2 = Math.pow(b2, y2) - a2, y2 = 1 / y2, function(t2) {
    return Math.pow(a2 + t2 * b2, y2);
  };
}
function hue(a2, b2) {
  var d = b2 - a2;
  return d ? linear$1(a2, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a2) ? b2 : a2);
}
function gamma(y2) {
  return (y2 = +y2) === 1 ? nogamma : function(a2, b2) {
    return b2 - a2 ? exponential(a2, b2, y2) : constant$1(isNaN(a2) ? b2 : a2);
  };
}
function nogamma(a2, b2) {
  var d = b2 - a2;
  return d ? linear$1(a2, d) : constant$1(isNaN(a2) ? b2 : a2);
}
const rgb = function rgbGamma(y2) {
  var color2 = gamma(y2);
  function rgb2(start, end) {
    var r2 = color2((start = rgb$1(start)).r, (end = rgb$1(end)).r), g2 = color2(start.g, end.g), b2 = color2(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
    return function(t2) {
      start.r = r2(t2);
      start.g = g2(t2);
      start.b = b2(t2);
      start.opacity = opacity(t2);
      return start + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function rgbSpline(spline) {
  return function(colors2) {
    var n2 = colors2.length, r2 = new Array(n2), g2 = new Array(n2), b2 = new Array(n2), i2, color2;
    for (i2 = 0; i2 < n2; ++i2) {
      color2 = rgb$1(colors2[i2]);
      r2[i2] = color2.r || 0;
      g2[i2] = color2.g || 0;
      b2[i2] = color2.b || 0;
    }
    r2 = spline(r2);
    g2 = spline(g2);
    b2 = spline(b2);
    color2.opacity = 1;
    return function(t2) {
      color2.r = r2(t2);
      color2.g = g2(t2);
      color2.b = b2(t2);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis$1);
function numberArray(a2, b2) {
  if (!b2) b2 = [];
  var n2 = a2 ? Math.min(b2.length, a2.length) : 0, c2 = b2.slice(), i2;
  return function(t2) {
    for (i2 = 0; i2 < n2; ++i2) c2[i2] = a2[i2] * (1 - t2) + b2[i2] * t2;
    return c2;
  };
}
function isNumberArray(x2) {
  return ArrayBuffer.isView(x2) && !(x2 instanceof DataView);
}
function genericArray(a2, b2) {
  var nb = b2 ? b2.length : 0, na = a2 ? Math.min(nb, a2.length) : 0, x2 = new Array(na), c2 = new Array(nb), i2;
  for (i2 = 0; i2 < na; ++i2) x2[i2] = interpolate(a2[i2], b2[i2]);
  for (; i2 < nb; ++i2) c2[i2] = b2[i2];
  return function(t2) {
    for (i2 = 0; i2 < na; ++i2) c2[i2] = x2[i2](t2);
    return c2;
  };
}
function date$1(a2, b2) {
  var d = /* @__PURE__ */ new Date();
  return a2 = +a2, b2 = +b2, function(t2) {
    return d.setTime(a2 * (1 - t2) + b2 * t2), d;
  };
}
function interpolateNumber(a2, b2) {
  return a2 = +a2, b2 = +b2, function(t2) {
    return a2 * (1 - t2) + b2 * t2;
  };
}
function object(a2, b2) {
  var i2 = {}, c2 = {}, k2;
  if (a2 === null || typeof a2 !== "object") a2 = {};
  if (b2 === null || typeof b2 !== "object") b2 = {};
  for (k2 in b2) {
    if (k2 in a2) {
      i2[k2] = interpolate(a2[k2], b2[k2]);
    } else {
      c2[k2] = b2[k2];
    }
  }
  return function(t2) {
    for (k2 in i2) c2[k2] = i2[k2](t2);
    return c2;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero$1(b2) {
  return function() {
    return b2;
  };
}
function one(b2) {
  return function(t2) {
    return b2(t2) + "";
  };
}
function _$4(a2, b2) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i2 = -1, s = [], q2 = [];
  a2 = a2 + "", b2 = b2 + "";
  while ((am = reA.exec(a2)) && (bm = reB.exec(b2))) {
    if ((bs = bm.index) > bi) {
      bs = b2.slice(bi, bs);
      if (s[i2]) s[i2] += bs;
      else s[++i2] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i2]) s[i2] += bm;
      else s[++i2] = bm;
    } else {
      s[++i2] = null;
      q2.push({ i: i2, x: interpolateNumber(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b2.length) {
    bs = b2.slice(bi);
    if (s[i2]) s[i2] += bs;
    else s[++i2] = bs;
  }
  return s.length < 2 ? q2[0] ? one(q2[0].x) : zero$1(b2) : (b2 = q2.length, function(t2) {
    for (var i3 = 0, o2; i3 < b2; ++i3) s[(o2 = q2[i3]).i] = o2.x(t2);
    return s.join("");
  });
}
function interpolate(a2, b2) {
  var t2 = typeof b2, c2;
  return b2 == null || t2 === "boolean" ? constant$1(b2) : (t2 === "number" ? interpolateNumber : t2 === "string" ? (c2 = color(b2)) ? (b2 = c2, rgb) : _$4 : b2 instanceof color ? rgb : b2 instanceof Date ? date$1 : isNumberArray(b2) ? numberArray : Array.isArray(b2) ? genericArray : typeof b2.valueOf !== "function" && typeof b2.toString !== "function" || isNaN(b2) ? object : interpolateNumber)(a2, b2);
}
function interpolateRound(a2, b2) {
  return a2 = +a2, b2 = +b2, function(t2) {
    return Math.round(a2 * (1 - t2) + b2 * t2);
  };
}
function cubehelix(hue2) {
  return function cubehelixGamma(y2) {
    y2 = +y2;
    function cubehelix2(start, end) {
      var h = hue2((start = cubehelix$1(start)).h, (end = cubehelix$1(end)).h), s = nogamma(start.s, end.s), l2 = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
      return function(t2) {
        start.h = h(t2);
        start.s = s(t2);
        start.l = l2(Math.pow(t2, y2));
        start.opacity = opacity(t2);
        return start + "";
      };
    }
    cubehelix2.gamma = cubehelixGamma;
    return cubehelix2;
  }(1);
}
cubehelix(hue);
var cubehelixLong = cubehelix(nogamma);
function ascending(a2, b2) {
  return a2 == null || b2 == null ? NaN : a2 < b2 ? -1 : a2 > b2 ? 1 : a2 >= b2 ? 0 : NaN;
}
function descending$1(a2, b2) {
  return a2 == null || b2 == null ? NaN : b2 < a2 ? -1 : b2 > a2 ? 1 : b2 >= a2 ? 0 : NaN;
}
function bisector(f2) {
  let compare1, compare2, delta;
  if (f2.length !== 2) {
    compare1 = ascending;
    compare2 = (d, x2) => ascending(f2(d), x2);
    delta = (d, x2) => f2(d) - x2;
  } else {
    compare1 = f2 === ascending || f2 === descending$1 ? f2 : zero;
    compare2 = f2;
    delta = f2;
  }
  function left(a2, x2, lo = 0, hi = a2.length) {
    if (lo < hi) {
      if (compare1(x2, x2) !== 0) return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a2[mid], x2) < 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right(a2, x2, lo = 0, hi = a2.length) {
    if (lo < hi) {
      if (compare1(x2, x2) !== 0) return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a2[mid], x2) <= 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center(a2, x2, lo = 0, hi = a2.length) {
    const i2 = left(a2, x2, lo, hi - 1);
    return i2 > lo && delta(a2[i2 - 1], x2) > -delta(a2[i2], x2) ? i2 - 1 : i2;
  }
  return { left, center, right };
}
function zero() {
  return 0;
}
function number$2(x2) {
  return x2 === null ? NaN : +x2;
}
const ascendingBisect = bisector(ascending);
const bisectRight = ascendingBisect.right;
bisector(number$2).center;
const e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
function tickSpec(start, stop, count) {
  const step = (stop - start) / Math.max(0, count), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}
function ticks(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  if (!(count > 0)) return [];
  if (start === stop) return [start];
  const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1)) return [];
  const n2 = i2 - i1 + 1, ticks2 = new Array(n2);
  if (reverse) {
    if (inc < 0) for (let i3 = 0; i3 < n2; ++i3) ticks2[i3] = (i2 - i3) / -inc;
    else for (let i3 = 0; i3 < n2; ++i3) ticks2[i3] = (i2 - i3) * inc;
  } else {
    if (inc < 0) for (let i3 = 0; i3 < n2; ++i3) ticks2[i3] = (i1 + i3) / -inc;
    else for (let i3 = 0; i3 < n2; ++i3) ticks2[i3] = (i1 + i3) * inc;
  }
  return ticks2;
}
function tickIncrement(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  return tickSpec(start, stop, count)[2];
}
function tickStep(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}
function range(start, stop, step) {
  start = +start, stop = +stop, step = (n2 = arguments.length) < 2 ? (stop = start, start = 0, 1) : n2 < 3 ? 1 : +step;
  var i2 = -1, n2 = Math.max(0, Math.ceil((stop - start) / step)) | 0, range2 = new Array(n2);
  while (++i2 < n2) {
    range2[i2] = start + i2 * step;
  }
  return range2;
}
function initRange(domain, range2) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range2).domain(domain);
      break;
  }
  return this;
}
const implicit = Symbol("implicit");
function ordinal() {
  var index = new InternMap(), domain = [], range2 = [], unknown = implicit;
  function scale(d) {
    let i2 = index.get(d);
    if (i2 === void 0) {
      if (unknown !== implicit) return unknown;
      index.set(d, i2 = domain.push(d) - 1);
    }
    return range2[i2 % range2.length];
  }
  scale.domain = function(_2) {
    if (!arguments.length) return domain.slice();
    domain = [], index = new InternMap();
    for (const value of _2) {
      if (index.has(value)) continue;
      index.set(value, domain.push(value) - 1);
    }
    return scale;
  };
  scale.range = function(_2) {
    return arguments.length ? (range2 = Array.from(_2), scale) : range2.slice();
  };
  scale.unknown = function(_2) {
    return arguments.length ? (unknown = _2, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range2).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}
function band() {
  var scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = false, paddingInner = 0, paddingOuter = 0, align = 0.5;
  delete scale.unknown;
  function rescale() {
    var n2 = domain().length, reverse = r1 < r0, start = reverse ? r1 : r0, stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n2 - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n2 - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = range(n2).map(function(i2) {
      return start + step * i2;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }
  scale.domain = function(_2) {
    return arguments.length ? (domain(_2), rescale()) : domain();
  };
  scale.range = function(_2) {
    return arguments.length ? ([r0, r1] = _2, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };
  scale.rangeRound = function(_2) {
    return [r0, r1] = _2, r0 = +r0, r1 = +r1, round = true, rescale();
  };
  scale.bandwidth = function() {
    return bandwidth;
  };
  scale.step = function() {
    return step;
  };
  scale.round = function(_2) {
    return arguments.length ? (round = !!_2, rescale()) : round;
  };
  scale.padding = function(_2) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_2), rescale()) : paddingInner;
  };
  scale.paddingInner = function(_2) {
    return arguments.length ? (paddingInner = Math.min(1, _2), rescale()) : paddingInner;
  };
  scale.paddingOuter = function(_2) {
    return arguments.length ? (paddingOuter = +_2, rescale()) : paddingOuter;
  };
  scale.align = function(_2) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _2)), rescale()) : align;
  };
  scale.copy = function() {
    return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };
  return initRange.apply(rescale(), arguments);
}
function pointish(scale) {
  var copy2 = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;
  scale.copy = function() {
    return pointish(copy2());
  };
  return scale;
}
function point$4() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}
function constants(x2) {
  return function() {
    return x2;
  };
}
function number$1(x2) {
  return +x2;
}
var unit = [0, 1];
function identity$2(x2) {
  return x2;
}
function normalize(a2, b2) {
  return (b2 -= a2 = +a2) ? function(x2) {
    return (x2 - a2) / b2;
  } : constants(isNaN(b2) ? NaN : 0.5);
}
function clamper(a2, b2) {
  var t2;
  if (a2 > b2) t2 = a2, a2 = b2, b2 = t2;
  return function(x2) {
    return Math.max(a2, Math.min(b2, x2));
  };
}
function bimap(domain, range2, interpolate2) {
  var d0 = domain[0], d1 = domain[1], r0 = range2[0], r1 = range2[1];
  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate2(r1, r0);
  else d0 = normalize(d0, d1), r0 = interpolate2(r0, r1);
  return function(x2) {
    return r0(d0(x2));
  };
}
function polymap(domain, range2, interpolate2) {
  var j2 = Math.min(domain.length, range2.length) - 1, d = new Array(j2), r2 = new Array(j2), i2 = -1;
  if (domain[j2] < domain[0]) {
    domain = domain.slice().reverse();
    range2 = range2.slice().reverse();
  }
  while (++i2 < j2) {
    d[i2] = normalize(domain[i2], domain[i2 + 1]);
    r2[i2] = interpolate2(range2[i2], range2[i2 + 1]);
  }
  return function(x2) {
    var i3 = bisectRight(domain, x2, 1, j2) - 1;
    return r2[i3](d[i3](x2));
  };
}
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
  var domain = unit, range2 = unit, interpolate$1 = interpolate, transform, untransform, unknown, clamp = identity$2, piecewise, output, input;
  function rescale() {
    var n2 = Math.min(domain.length, range2.length);
    if (clamp !== identity$2) clamp = clamper(domain[0], domain[n2 - 1]);
    piecewise = n2 > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }
  function scale(x2) {
    return x2 == null || isNaN(x2 = +x2) ? unknown : (output || (output = piecewise(domain.map(transform), range2, interpolate$1)))(transform(clamp(x2)));
  }
  scale.invert = function(y2) {
    return clamp(untransform((input || (input = piecewise(range2, domain.map(transform), interpolateNumber)))(y2)));
  };
  scale.domain = function(_2) {
    return arguments.length ? (domain = Array.from(_2, number$1), rescale()) : domain.slice();
  };
  scale.range = function(_2) {
    return arguments.length ? (range2 = Array.from(_2), rescale()) : range2.slice();
  };
  scale.rangeRound = function(_2) {
    return range2 = Array.from(_2), interpolate$1 = interpolateRound, rescale();
  };
  scale.clamp = function(_2) {
    return arguments.length ? (clamp = _2 ? true : identity$2, rescale()) : clamp !== identity$2;
  };
  scale.interpolate = function(_2) {
    return arguments.length ? (interpolate$1 = _2, rescale()) : interpolate$1;
  };
  scale.unknown = function(_2) {
    return arguments.length ? (unknown = _2, scale) : unknown;
  };
  return function(t2, u2) {
    transform = t2, untransform = u2;
    return rescale();
  };
}
function continuous() {
  return transformer()(identity$2, identity$2);
}
function formatDecimal(x2) {
  return Math.abs(x2 = Math.round(x2)) >= 1e21 ? x2.toLocaleString("en").replace(/,/g, "") : x2.toString(10);
}
function formatDecimalParts(x2, p2) {
  if ((i2 = (x2 = p2 ? x2.toExponential(p2 - 1) : x2.toExponential()).indexOf("e")) < 0) return null;
  var i2, coefficient = x2.slice(0, i2);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x2.slice(i2 + 1)
  ];
}
function exponent(x2) {
  return x2 = formatDecimalParts(Math.abs(x2)), x2 ? x2[1] : NaN;
}
function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i2 = value.length, t2 = [], j2 = 0, g2 = grouping[0], length = 0;
    while (i2 > 0 && g2 > 0) {
      if (length + g2 + 1 > width) g2 = Math.max(1, width - length);
      t2.push(value.substring(i2 -= g2, i2 + g2));
      if ((length += g2 + 1) > width) break;
      g2 = grouping[j2 = (j2 + 1) % grouping.length];
    }
    return t2.reverse().join(thousands);
  };
}
function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i2) {
      return numerals[+i2];
    });
  };
}
var re$1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re$1.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function formatTrim(s) {
  out: for (var n2 = s.length, i2 = 1, i0 = -1, i1; i2 < n2; ++i2) {
    switch (s[i2]) {
      case ".":
        i0 = i1 = i2;
        break;
      case "0":
        if (i0 === 0) i0 = i2;
        i1 = i2;
        break;
      default:
        if (!+s[i2]) break out;
        if (i0 > 0) i0 = 0;
        break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
var prefixExponent;
function formatPrefixAuto(x2, p2) {
  var d = formatDecimalParts(x2, p2);
  if (!d) return x2 + "";
  var coefficient = d[0], exponent2 = d[1], i2 = exponent2 - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent2 / 3))) * 3) + 1, n2 = coefficient.length;
  return i2 === n2 ? coefficient : i2 > n2 ? coefficient + new Array(i2 - n2 + 1).join("0") : i2 > 0 ? coefficient.slice(0, i2) + "." + coefficient.slice(i2) : "0." + new Array(1 - i2).join("0") + formatDecimalParts(x2, Math.max(0, p2 + i2 - 1))[0];
}
function formatRounded(x2, p2) {
  var d = formatDecimalParts(x2, p2);
  if (!d) return x2 + "";
  var coefficient = d[0], exponent2 = d[1];
  return exponent2 < 0 ? "0." + new Array(-exponent2).join("0") + coefficient : coefficient.length > exponent2 + 1 ? coefficient.slice(0, exponent2 + 1) + "." + coefficient.slice(exponent2 + 1) : coefficient + new Array(exponent2 - coefficient.length + 2).join("0");
}
const formatTypes = {
  "%": function(x2, p2) {
    return (x2 * 100).toFixed(p2);
  },
  "b": function(x2) {
    return Math.round(x2).toString(2);
  },
  "c": function(x2) {
    return x2 + "";
  },
  "d": formatDecimal,
  "e": function(x2, p2) {
    return x2.toExponential(p2);
  },
  "f": function(x2, p2) {
    return x2.toFixed(p2);
  },
  "g": function(x2, p2) {
    return x2.toPrecision(p2);
  },
  "o": function(x2) {
    return Math.round(x2).toString(8);
  },
  "p": function(x2, p2) {
    return formatRounded(x2 * 100, p2);
  },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x2) {
    return Math.round(x2).toString(16).toUpperCase();
  },
  "x": function(x2) {
    return Math.round(x2).toString(16);
  }
};
function identity$1(x2) {
  return x2;
}
var map = Array.prototype.map, prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function formatLocale$1(locale2) {
  var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity$1 : formatGroup(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity$1 : formatNumerals(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "-" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign2 = specifier.sign, symbol = specifier.symbol, zero2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n") comma = true, type = "g";
    else if (!formatTypes[type]) precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero2 || fill === "0" && align === "=") zero2 = true, fill = "0", align = "=";
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format2(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i2, n2, c2;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim) value = formatTrim(value);
        if (valueNegative && +value === 0 && sign2 !== "+") valueNegative = false;
        valuePrefix = (valueNegative ? sign2 === "(" ? sign2 : minus : sign2 === "-" || sign2 === "(" ? "" : sign2) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign2 === "(" ? ")" : "");
        if (maybeSuffix) {
          i2 = -1, n2 = value.length;
          while (++i2 < n2) {
            if (c2 = value.charCodeAt(i2), 48 > c2 || c2 > 57) {
              valueSuffix = (c2 === 46 ? decimal + value.slice(i2 + 1) : value.slice(i2)) + valueSuffix;
              value = value.slice(0, i2);
              break;
            }
          }
        }
      }
      if (comma && !zero2) value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero2) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format2.toString = function() {
      return specifier + "";
    };
    return format2;
  }
  function formatPrefix2(specifier, value) {
    var f2 = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e3 = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3, k2 = Math.pow(10, -e3), prefix = prefixes[8 + e3 / 3];
    return function(value2) {
      return f2(k2 * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}
var locale$1;
var format;
var formatPrefix;
defaultLocale$1({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});
function defaultLocale$1(definition) {
  locale$1 = formatLocale$1(definition);
  format = locale$1.format;
  formatPrefix = locale$1.formatPrefix;
  return locale$1;
}
function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}
function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}
function precisionRound(step, max2) {
  step = Math.abs(step), max2 = Math.abs(max2) - step;
  return Math.max(0, exponent(max2) - exponent(step)) + 1;
}
function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count), precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}
function linearish(scale) {
  var domain = scale.domain;
  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };
  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };
  scale.nice = function(count) {
    if (count == null) count = 10;
    var d = domain();
    var i0 = 0;
    var i1 = d.length - 1;
    var start = d[i0];
    var stop = d[i1];
    var prestep;
    var step;
    var maxIter = 10;
    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d[i0] = start;
        d[i1] = stop;
        return domain(d);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }
    return scale;
  };
  return scale;
}
function linear() {
  var scale = continuous();
  scale.copy = function() {
    return copy(scale, linear());
  };
  initRange.apply(scale, arguments);
  return linearish(scale);
}
function nice(domain, interval) {
  domain = domain.slice();
  var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], t2;
  if (x1 < x0) {
    t2 = i0, i0 = i1, i1 = t2;
    t2 = x0, x0 = x1, x1 = t2;
  }
  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}
function transformLog(x2) {
  return Math.log(x2);
}
function transformExp(x2) {
  return Math.exp(x2);
}
function transformLogn(x2) {
  return -Math.log(-x2);
}
function transformExpn(x2) {
  return -Math.exp(-x2);
}
function pow10(x2) {
  return isFinite(x2) ? +("1e" + x2) : x2 < 0 ? 0 : x2;
}
function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : (x2) => Math.pow(base, x2);
}
function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), (x2) => Math.log(x2) / base);
}
function reflect(f2) {
  return (x2, k2) => -f2(-x2, k2);
}
function loggish(transform) {
  const scale = transform(transformLog, transformExp);
  const domain = scale.domain;
  let base = 10;
  let logs;
  let pows;
  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }
    return scale;
  }
  scale.base = function(_2) {
    return arguments.length ? (base = +_2, rescale()) : base;
  };
  scale.domain = function(_2) {
    return arguments.length ? (domain(_2), rescale()) : domain();
  };
  scale.ticks = (count) => {
    const d = domain();
    let u2 = d[0];
    let v2 = d[d.length - 1];
    const r2 = v2 < u2;
    if (r2) [u2, v2] = [v2, u2];
    let i2 = logs(u2);
    let j2 = logs(v2);
    let k2;
    let t2;
    const n2 = count == null ? 10 : +count;
    let z2 = [];
    if (!(base % 1) && j2 - i2 < n2) {
      i2 = Math.floor(i2), j2 = Math.ceil(j2);
      if (u2 > 0) for (; i2 <= j2; ++i2) {
        for (k2 = 1; k2 < base; ++k2) {
          t2 = i2 < 0 ? k2 / pows(-i2) : k2 * pows(i2);
          if (t2 < u2) continue;
          if (t2 > v2) break;
          z2.push(t2);
        }
      }
      else for (; i2 <= j2; ++i2) {
        for (k2 = base - 1; k2 >= 1; --k2) {
          t2 = i2 > 0 ? k2 / pows(-i2) : k2 * pows(i2);
          if (t2 < u2) continue;
          if (t2 > v2) break;
          z2.push(t2);
        }
      }
      if (z2.length * 2 < n2) z2 = ticks(u2, v2, n2);
    } else {
      z2 = ticks(i2, j2, Math.min(j2 - i2, n2)).map(pows);
    }
    return r2 ? z2.reverse() : z2;
  };
  scale.tickFormat = (count, specifier) => {
    if (count == null) count = 10;
    if (specifier == null) specifier = base === 10 ? "s" : ",";
    if (typeof specifier !== "function") {
      if (!(base % 1) && (specifier = formatSpecifier(specifier)).precision == null) specifier.trim = true;
      specifier = format(specifier);
    }
    if (count === Infinity) return specifier;
    const k2 = Math.max(1, base * count / scale.ticks().length);
    return (d) => {
      let i2 = d / pows(Math.round(logs(d)));
      if (i2 * base < base - 0.5) i2 *= base;
      return i2 <= k2 ? specifier(d) : "";
    };
  };
  scale.nice = () => {
    return domain(nice(domain(), {
      floor: (x2) => pows(Math.floor(logs(x2))),
      ceil: (x2) => pows(Math.ceil(logs(x2)))
    }));
  };
  return scale;
}
function log() {
  const scale = loggish(transformer()).domain([1, 10]);
  scale.copy = () => copy(scale, log()).base(scale.base());
  initRange.apply(scale, arguments);
  return scale;
}
function transformSymlog(c2) {
  return function(x2) {
    return Math.sign(x2) * Math.log1p(Math.abs(x2 / c2));
  };
}
function transformSymexp(c2) {
  return function(x2) {
    return Math.sign(x2) * Math.expm1(Math.abs(x2)) * c2;
  };
}
function symlogish(transform) {
  var c2 = 1, scale = transform(transformSymlog(c2), transformSymexp(c2));
  scale.constant = function(_2) {
    return arguments.length ? transform(transformSymlog(c2 = +_2), transformSymexp(c2)) : c2;
  };
  return linearish(scale);
}
function symlog() {
  var scale = symlogish(transformer());
  scale.copy = function() {
    return copy(scale, symlog()).constant(scale.constant());
  };
  return initRange.apply(scale, arguments);
}
const t0$1 = /* @__PURE__ */ new Date(), t1$1 = /* @__PURE__ */ new Date();
function timeInterval(floori, offseti, count, field) {
  function interval(date2) {
    return floori(date2 = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+date2)), date2;
  }
  interval.floor = (date2) => {
    return floori(date2 = /* @__PURE__ */ new Date(+date2)), date2;
  };
  interval.ceil = (date2) => {
    return floori(date2 = new Date(date2 - 1)), offseti(date2, 1), floori(date2), date2;
  };
  interval.round = (date2) => {
    const d0 = interval(date2), d1 = interval.ceil(date2);
    return date2 - d0 < d1 - date2 ? d0 : d1;
  };
  interval.offset = (date2, step) => {
    return offseti(date2 = /* @__PURE__ */ new Date(+date2), step == null ? 1 : Math.floor(step)), date2;
  };
  interval.range = (start, stop, step) => {
    const range2 = [];
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range2;
    let previous;
    do
      range2.push(previous = /* @__PURE__ */ new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range2;
  };
  interval.filter = (test) => {
    return timeInterval((date2) => {
      if (date2 >= date2) while (floori(date2), !test(date2)) date2.setTime(date2 - 1);
    }, (date2, step) => {
      if (date2 >= date2) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date2, -1), !test(date2)) {
          }
        }
        else while (--step >= 0) {
          while (offseti(date2, 1), !test(date2)) {
          }
        }
      }
    });
  };
  if (count) {
    interval.count = (start, end) => {
      t0$1.setTime(+start), t1$1.setTime(+end);
      floori(t0$1), floori(t1$1);
      return Math.floor(count(t0$1, t1$1));
    };
    interval.every = (step) => {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? (d) => field(d) % step === 0 : (d) => interval.count(0, d) % step === 0);
    };
  }
  return interval;
}
const millisecond$1 = timeInterval(() => {
}, (date2, step) => {
  date2.setTime(+date2 + step);
}, (start, end) => {
  return end - start;
});
millisecond$1.every = (k2) => {
  k2 = Math.floor(k2);
  if (!isFinite(k2) || !(k2 > 0)) return null;
  if (!(k2 > 1)) return millisecond$1;
  return timeInterval((date2) => {
    date2.setTime(Math.floor(date2 / k2) * k2);
  }, (date2, step) => {
    date2.setTime(+date2 + step * k2);
  }, (start, end) => {
    return (end - start) / k2;
  });
};
millisecond$1.range;
const durationSecond$1 = 1e3;
const durationMinute$1 = durationSecond$1 * 60;
const durationHour$1 = durationMinute$1 * 60;
const durationDay$1 = durationHour$1 * 24;
const durationWeek$1 = durationDay$1 * 7;
const durationMonth = durationDay$1 * 30;
const durationYear = durationDay$1 * 365;
const second$1 = timeInterval((date2) => {
  date2.setTime(date2 - date2.getMilliseconds());
}, (date2, step) => {
  date2.setTime(+date2 + step * durationSecond$1);
}, (start, end) => {
  return (end - start) / durationSecond$1;
}, (date2) => {
  return date2.getUTCSeconds();
});
second$1.range;
const timeMinute = timeInterval((date2) => {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond$1);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationMinute$1);
}, (start, end) => {
  return (end - start) / durationMinute$1;
}, (date2) => {
  return date2.getMinutes();
});
timeMinute.range;
const utcMinute$1 = timeInterval((date2) => {
  date2.setUTCSeconds(0, 0);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationMinute$1);
}, (start, end) => {
  return (end - start) / durationMinute$1;
}, (date2) => {
  return date2.getUTCMinutes();
});
utcMinute$1.range;
const timeHour = timeInterval((date2) => {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond$1 - date2.getMinutes() * durationMinute$1);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationHour$1);
}, (start, end) => {
  return (end - start) / durationHour$1;
}, (date2) => {
  return date2.getHours();
});
timeHour.range;
const utcHour$1 = timeInterval((date2) => {
  date2.setUTCMinutes(0, 0, 0);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationHour$1);
}, (start, end) => {
  return (end - start) / durationHour$1;
}, (date2) => {
  return date2.getUTCHours();
});
utcHour$1.range;
const timeDay = timeInterval(
  (date2) => date2.setHours(0, 0, 0, 0),
  (date2, step) => date2.setDate(date2.getDate() + step),
  (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1,
  (date2) => date2.getDate() - 1
);
timeDay.range;
const utcDay$1 = timeInterval((date2) => {
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCDate(date2.getUTCDate() + step);
}, (start, end) => {
  return (end - start) / durationDay$1;
}, (date2) => {
  return date2.getUTCDate() - 1;
});
utcDay$1.range;
const unixDay = timeInterval((date2) => {
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCDate(date2.getUTCDate() + step);
}, (start, end) => {
  return (end - start) / durationDay$1;
}, (date2) => {
  return Math.floor(date2 / durationDay$1);
});
unixDay.range;
function timeWeekday(i2) {
  return timeInterval((date2) => {
    date2.setDate(date2.getDate() - (date2.getDay() + 7 - i2) % 7);
    date2.setHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setDate(date2.getDate() + step * 7);
  }, (start, end) => {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
  });
}
const timeSunday = timeWeekday(0);
const timeMonday = timeWeekday(1);
const timeTuesday = timeWeekday(2);
const timeWednesday = timeWeekday(3);
const timeThursday = timeWeekday(4);
const timeFriday = timeWeekday(5);
const timeSaturday = timeWeekday(6);
timeSunday.range;
timeMonday.range;
timeTuesday.range;
timeWednesday.range;
timeThursday.range;
timeFriday.range;
timeSaturday.range;
function utcWeekday$1(i2) {
  return timeInterval((date2) => {
    date2.setUTCDate(date2.getUTCDate() - (date2.getUTCDay() + 7 - i2) % 7);
    date2.setUTCHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setUTCDate(date2.getUTCDate() + step * 7);
  }, (start, end) => {
    return (end - start) / durationWeek$1;
  });
}
const utcSunday$1 = utcWeekday$1(0);
const utcMonday$1 = utcWeekday$1(1);
const utcTuesday$1 = utcWeekday$1(2);
const utcWednesday$1 = utcWeekday$1(3);
const utcThursday$1 = utcWeekday$1(4);
const utcFriday$1 = utcWeekday$1(5);
const utcSaturday$1 = utcWeekday$1(6);
utcSunday$1.range;
utcMonday$1.range;
utcTuesday$1.range;
utcWednesday$1.range;
utcThursday$1.range;
utcFriday$1.range;
utcSaturday$1.range;
const timeMonth = timeInterval((date2) => {
  date2.setDate(1);
  date2.setHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setMonth(date2.getMonth() + step);
}, (start, end) => {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, (date2) => {
  return date2.getMonth();
});
timeMonth.range;
const utcMonth$1 = timeInterval((date2) => {
  date2.setUTCDate(1);
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCMonth(date2.getUTCMonth() + step);
}, (start, end) => {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, (date2) => {
  return date2.getUTCMonth();
});
utcMonth$1.range;
const timeYear = timeInterval((date2) => {
  date2.setMonth(0, 1);
  date2.setHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setFullYear(date2.getFullYear() + step);
}, (start, end) => {
  return end.getFullYear() - start.getFullYear();
}, (date2) => {
  return date2.getFullYear();
});
timeYear.every = (k2) => {
  return !isFinite(k2 = Math.floor(k2)) || !(k2 > 0) ? null : timeInterval((date2) => {
    date2.setFullYear(Math.floor(date2.getFullYear() / k2) * k2);
    date2.setMonth(0, 1);
    date2.setHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setFullYear(date2.getFullYear() + step * k2);
  });
};
timeYear.range;
const utcYear$1 = timeInterval((date2) => {
  date2.setUTCMonth(0, 1);
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCFullYear(date2.getUTCFullYear() + step);
}, (start, end) => {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, (date2) => {
  return date2.getUTCFullYear();
});
utcYear$1.every = (k2) => {
  return !isFinite(k2 = Math.floor(k2)) || !(k2 > 0) ? null : timeInterval((date2) => {
    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / k2) * k2);
    date2.setUTCMonth(0, 1);
    date2.setUTCHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setUTCFullYear(date2.getUTCFullYear() + step * k2);
  });
};
utcYear$1.range;
function ticker(year2, month2, week, day2, hour2, minute2) {
  const tickIntervals = [
    [second$1, 1, durationSecond$1],
    [second$1, 5, 5 * durationSecond$1],
    [second$1, 15, 15 * durationSecond$1],
    [second$1, 30, 30 * durationSecond$1],
    [minute2, 1, durationMinute$1],
    [minute2, 5, 5 * durationMinute$1],
    [minute2, 15, 15 * durationMinute$1],
    [minute2, 30, 30 * durationMinute$1],
    [hour2, 1, durationHour$1],
    [hour2, 3, 3 * durationHour$1],
    [hour2, 6, 6 * durationHour$1],
    [hour2, 12, 12 * durationHour$1],
    [day2, 1, durationDay$1],
    [day2, 2, 2 * durationDay$1],
    [week, 1, durationWeek$1],
    [month2, 1, durationMonth],
    [month2, 3, 3 * durationMonth],
    [year2, 1, durationYear]
  ];
  function ticks2(start, stop, count) {
    const reverse = stop < start;
    if (reverse) [start, stop] = [stop, start];
    const interval = count && typeof count.range === "function" ? count : tickInterval(start, stop, count);
    const ticks3 = interval ? interval.range(start, +stop + 1) : [];
    return reverse ? ticks3.reverse() : ticks3;
  }
  function tickInterval(start, stop, count) {
    const target = Math.abs(stop - start) / count;
    const i2 = bisector(([, , step2]) => step2).right(tickIntervals, target);
    if (i2 === tickIntervals.length) return year2.every(tickStep(start / durationYear, stop / durationYear, count));
    if (i2 === 0) return millisecond$1.every(Math.max(tickStep(start, stop, count), 1));
    const [t2, step] = tickIntervals[target / tickIntervals[i2 - 1][2] < tickIntervals[i2][2] / target ? i2 - 1 : i2];
    return t2.every(step);
  }
  return [ticks2, tickInterval];
}
const [utcTicks, utcTickInterval] = ticker(utcYear$1, utcMonth$1, utcSunday$1, unixDay, utcHour$1, utcMinute$1);
const [timeTicks, timeTickInterval] = ticker(timeYear, timeMonth, timeSunday, timeDay, timeHour, timeMinute);
var t0 = /* @__PURE__ */ new Date(), t1 = /* @__PURE__ */ new Date();
function newInterval(floori, offseti, count, field) {
  function interval(date2) {
    return floori(date2 = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+date2)), date2;
  }
  interval.floor = function(date2) {
    return floori(date2 = /* @__PURE__ */ new Date(+date2)), date2;
  };
  interval.ceil = function(date2) {
    return floori(date2 = new Date(date2 - 1)), offseti(date2, 1), floori(date2), date2;
  };
  interval.round = function(date2) {
    var d0 = interval(date2), d1 = interval.ceil(date2);
    return date2 - d0 < d1 - date2 ? d0 : d1;
  };
  interval.offset = function(date2, step) {
    return offseti(date2 = /* @__PURE__ */ new Date(+date2), step == null ? 1 : Math.floor(step)), date2;
  };
  interval.range = function(start, stop, step) {
    var range2 = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range2;
    do
      range2.push(previous = /* @__PURE__ */ new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range2;
  };
  interval.filter = function(test) {
    return newInterval(function(date2) {
      if (date2 >= date2) while (floori(date2), !test(date2)) date2.setTime(date2 - 1);
    }, function(date2, step) {
      if (date2 >= date2) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date2, -1), !test(date2)) {
          }
        }
        else while (--step >= 0) {
          while (offseti(date2, 1), !test(date2)) {
          }
        }
      }
    });
  };
  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };
    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function(d) {
        return field(d) % step === 0;
      } : function(d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }
  return interval;
}
var millisecond = newInterval(function() {
}, function(date2, step) {
  date2.setTime(+date2 + step);
}, function(start, end) {
  return end - start;
});
millisecond.every = function(k2) {
  k2 = Math.floor(k2);
  if (!isFinite(k2) || !(k2 > 0)) return null;
  if (!(k2 > 1)) return millisecond;
  return newInterval(function(date2) {
    date2.setTime(Math.floor(date2 / k2) * k2);
  }, function(date2, step) {
    date2.setTime(+date2 + step * k2);
  }, function(start, end) {
    return (end - start) / k2;
  });
};
millisecond.range;
var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationDay = 864e5;
var durationWeek = 6048e5;
var second = newInterval(function(date2) {
  date2.setTime(date2 - date2.getMilliseconds());
}, function(date2, step) {
  date2.setTime(+date2 + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date2) {
  return date2.getUTCSeconds();
});
second.range;
var minute = newInterval(function(date2) {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date2) {
  return date2.getMinutes();
});
minute.range;
var hour = newInterval(function(date2) {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond - date2.getMinutes() * durationMinute);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date2) {
  return date2.getHours();
});
hour.range;
var day = newInterval(function(date2) {
  date2.setHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setDate(date2.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date2) {
  return date2.getDate() - 1;
});
day.range;
function weekday(i2) {
  return newInterval(function(date2) {
    date2.setDate(date2.getDate() - (date2.getDay() + 7 - i2) % 7);
    date2.setHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setDate(date2.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}
var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);
sunday.range;
monday.range;
tuesday.range;
wednesday.range;
thursday.range;
friday.range;
saturday.range;
var month = newInterval(function(date2) {
  date2.setDate(1);
  date2.setHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setMonth(date2.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date2) {
  return date2.getMonth();
});
month.range;
var year = newInterval(function(date2) {
  date2.setMonth(0, 1);
  date2.setHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setFullYear(date2.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date2) {
  return date2.getFullYear();
});
year.every = function(k2) {
  return !isFinite(k2 = Math.floor(k2)) || !(k2 > 0) ? null : newInterval(function(date2) {
    date2.setFullYear(Math.floor(date2.getFullYear() / k2) * k2);
    date2.setMonth(0, 1);
    date2.setHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setFullYear(date2.getFullYear() + step * k2);
  });
};
year.range;
var utcMinute = newInterval(function(date2) {
  date2.setUTCSeconds(0, 0);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date2) {
  return date2.getUTCMinutes();
});
utcMinute.range;
var utcHour = newInterval(function(date2) {
  date2.setUTCMinutes(0, 0, 0);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date2) {
  return date2.getUTCHours();
});
utcHour.range;
var utcDay = newInterval(function(date2) {
  date2.setUTCHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setUTCDate(date2.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay;
}, function(date2) {
  return date2.getUTCDate() - 1;
});
utcDay.range;
function utcWeekday(i2) {
  return newInterval(function(date2) {
    date2.setUTCDate(date2.getUTCDate() - (date2.getUTCDay() + 7 - i2) % 7);
    date2.setUTCHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setUTCDate(date2.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}
var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);
utcSunday.range;
utcMonday.range;
utcTuesday.range;
utcWednesday.range;
utcThursday.range;
utcFriday.range;
utcSaturday.range;
var utcMonth = newInterval(function(date2) {
  date2.setUTCDate(1);
  date2.setUTCHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setUTCMonth(date2.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date2) {
  return date2.getUTCMonth();
});
utcMonth.range;
var utcYear = newInterval(function(date2) {
  date2.setUTCMonth(0, 1);
  date2.setUTCHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setUTCFullYear(date2.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date2) {
  return date2.getUTCFullYear();
});
utcYear.every = function(k2) {
  return !isFinite(k2 = Math.floor(k2)) || !(k2 > 0) ? null : newInterval(function(date2) {
    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / k2) * k2);
    date2.setUTCMonth(0, 1);
    date2.setUTCHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setUTCFullYear(date2.getUTCFullYear() + step * k2);
  });
};
utcYear.range;
function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date2 = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date2.setFullYear(d.y);
    return date2;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date2 = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date2.setUTCFullYear(d.y);
    return date2;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
function newDate(y2, m2, d) {
  return { y: y2, m: m2, d, H: 0, M: 0, S: 0, L: 0 };
}
function formatLocale(locale2) {
  var locale_dateTime = locale2.dateTime, locale_date = locale2.date, locale_time = locale2.time, locale_periods = locale2.periods, locale_weekdays = locale2.days, locale_shortWeekdays = locale2.shortDays, locale_months = locale2.months, locale_shortMonths = locale2.shortMonths;
  var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "g": formatYearISO,
    "G": formatFullYearISO,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "g": formatUTCYearISO,
    "G": formatUTCFullYearISO,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "g": parseYear,
    "G": parseFullYear,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);
  function newFormat(specifier, formats2) {
    return function(date2) {
      var string = [], i2 = -1, j2 = 0, n2 = specifier.length, c2, pad2, format2;
      if (!(date2 instanceof Date)) date2 = /* @__PURE__ */ new Date(+date2);
      while (++i2 < n2) {
        if (specifier.charCodeAt(i2) === 37) {
          string.push(specifier.slice(j2, i2));
          if ((pad2 = pads[c2 = specifier.charAt(++i2)]) != null) c2 = specifier.charAt(++i2);
          else pad2 = c2 === "e" ? " " : "0";
          if (format2 = formats2[c2]) c2 = format2(date2, pad2);
          string.push(c2);
          j2 = i2 + 1;
        }
      }
      string.push(specifier.slice(j2, i2));
      return string.join("");
    };
  }
  function newParse(specifier, Z2) {
    return function(string) {
      var d = newDate(1900, void 0, 1), i2 = parseSpecifier(d, specifier, string += "", 0), week, day$1;
      if (i2 != string.length) return null;
      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1e3 + ("L" in d ? d.L : 0));
      if (Z2 && !("Z" in d)) d.Z = 0;
      if ("p" in d) d.H = d.H % 12 + d.p * 12;
      if (d.m === void 0) d.m = "q" in d ? d.q : 0;
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
          week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
          week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
          week = day.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
      }
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }
      return localDate(d);
    };
  }
  function parseSpecifier(d, specifier, string, j2) {
    var i2 = 0, n2 = specifier.length, m2 = string.length, c2, parse;
    while (i2 < n2) {
      if (j2 >= m2) return -1;
      c2 = specifier.charCodeAt(i2++);
      if (c2 === 37) {
        c2 = specifier.charAt(i2++);
        parse = parses[c2 in pads ? specifier.charAt(i2++) : c2];
        if (!parse || (j2 = parse(d, string, j2)) < 0) return -1;
      } else if (c2 != string.charCodeAt(j2++)) {
        return -1;
      }
    }
    return j2;
  }
  function parsePeriod(d, string, i2) {
    var n2 = periodRe.exec(string.slice(i2));
    return n2 ? (d.p = periodLookup.get(n2[0].toLowerCase()), i2 + n2[0].length) : -1;
  }
  function parseShortWeekday(d, string, i2) {
    var n2 = shortWeekdayRe.exec(string.slice(i2));
    return n2 ? (d.w = shortWeekdayLookup.get(n2[0].toLowerCase()), i2 + n2[0].length) : -1;
  }
  function parseWeekday(d, string, i2) {
    var n2 = weekdayRe.exec(string.slice(i2));
    return n2 ? (d.w = weekdayLookup.get(n2[0].toLowerCase()), i2 + n2[0].length) : -1;
  }
  function parseShortMonth(d, string, i2) {
    var n2 = shortMonthRe.exec(string.slice(i2));
    return n2 ? (d.m = shortMonthLookup.get(n2[0].toLowerCase()), i2 + n2[0].length) : -1;
  }
  function parseMonth(d, string, i2) {
    var n2 = monthRe.exec(string.slice(i2));
    return n2 ? (d.m = monthLookup.get(n2[0].toLowerCase()), i2 + n2[0].length) : -1;
  }
  function parseLocaleDateTime(d, string, i2) {
    return parseSpecifier(d, locale_dateTime, string, i2);
  }
  function parseLocaleDate(d, string, i2) {
    return parseSpecifier(d, locale_date, string, i2);
  }
  function parseLocaleTime(d, string, i2) {
    return parseSpecifier(d, locale_time, string, i2);
  }
  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }
  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }
  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }
  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }
  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }
  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }
  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }
  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }
  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }
  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }
  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }
  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }
  return {
    format: function(specifier) {
      var f2 = newFormat(specifier += "", formats);
      f2.toString = function() {
        return specifier;
      };
      return f2;
    },
    parse: function(specifier) {
      var p2 = newParse(specifier += "", false);
      p2.toString = function() {
        return specifier;
      };
      return p2;
    },
    utcFormat: function(specifier) {
      var f2 = newFormat(specifier += "", utcFormats);
      f2.toString = function() {
        return specifier;
      };
      return f2;
    },
    utcParse: function(specifier) {
      var p2 = newParse(specifier += "", true);
      p2.toString = function() {
        return specifier;
      };
      return p2;
    }
  };
}
var pads = { "-": "", "_": " ", "0": "0" }, numberRe = /^\s*\d+/, percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
function pad(value, fill, width) {
  var sign2 = value < 0 ? "-" : "", string = (sign2 ? -value : value) + "", length = string.length;
  return sign2 + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
function requote(s) {
  return s.replace(requoteRe, "\\$&");
}
function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}
function formatLookup(names) {
  return new Map(names.map((name, i2) => [name.toLowerCase(), i2]));
}
function parseWeekdayNumberSunday(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 1));
  return n2 ? (d.w = +n2[0], i2 + n2[0].length) : -1;
}
function parseWeekdayNumberMonday(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 1));
  return n2 ? (d.u = +n2[0], i2 + n2[0].length) : -1;
}
function parseWeekNumberSunday(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.U = +n2[0], i2 + n2[0].length) : -1;
}
function parseWeekNumberISO(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.V = +n2[0], i2 + n2[0].length) : -1;
}
function parseWeekNumberMonday(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.W = +n2[0], i2 + n2[0].length) : -1;
}
function parseFullYear(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 4));
  return n2 ? (d.y = +n2[0], i2 + n2[0].length) : -1;
}
function parseYear(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.y = +n2[0] + (+n2[0] > 68 ? 1900 : 2e3), i2 + n2[0].length) : -1;
}
function parseZone(d, string, i2) {
  var n2 = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i2, i2 + 6));
  return n2 ? (d.Z = n2[1] ? 0 : -(n2[2] + (n2[3] || "00")), i2 + n2[0].length) : -1;
}
function parseQuarter(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 1));
  return n2 ? (d.q = n2[0] * 3 - 3, i2 + n2[0].length) : -1;
}
function parseMonthNumber(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.m = n2[0] - 1, i2 + n2[0].length) : -1;
}
function parseDayOfMonth(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.d = +n2[0], i2 + n2[0].length) : -1;
}
function parseDayOfYear(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 3));
  return n2 ? (d.m = 0, d.d = +n2[0], i2 + n2[0].length) : -1;
}
function parseHour24(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.H = +n2[0], i2 + n2[0].length) : -1;
}
function parseMinutes(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.M = +n2[0], i2 + n2[0].length) : -1;
}
function parseSeconds(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 2));
  return n2 ? (d.S = +n2[0], i2 + n2[0].length) : -1;
}
function parseMilliseconds(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 3));
  return n2 ? (d.L = +n2[0], i2 + n2[0].length) : -1;
}
function parseMicroseconds(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2, i2 + 6));
  return n2 ? (d.L = Math.floor(n2[0] / 1e3), i2 + n2[0].length) : -1;
}
function parseLiteralPercent(d, string, i2) {
  var n2 = percentRe.exec(string.slice(i2, i2 + 1));
  return n2 ? i2 + n2[0].length : -1;
}
function parseUnixTimestamp(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2));
  return n2 ? (d.Q = +n2[0], i2 + n2[0].length) : -1;
}
function parseUnixTimestampSeconds(d, string, i2) {
  var n2 = numberRe.exec(string.slice(i2));
  return n2 ? (d.s = +n2[0], i2 + n2[0].length) : -1;
}
function formatDayOfMonth(d, p2) {
  return pad(d.getDate(), p2, 2);
}
function formatHour24(d, p2) {
  return pad(d.getHours(), p2, 2);
}
function formatHour12(d, p2) {
  return pad(d.getHours() % 12 || 12, p2, 2);
}
function formatDayOfYear(d, p2) {
  return pad(1 + day.count(year(d), d), p2, 3);
}
function formatMilliseconds(d, p2) {
  return pad(d.getMilliseconds(), p2, 3);
}
function formatMicroseconds(d, p2) {
  return formatMilliseconds(d, p2) + "000";
}
function formatMonthNumber(d, p2) {
  return pad(d.getMonth() + 1, p2, 2);
}
function formatMinutes(d, p2) {
  return pad(d.getMinutes(), p2, 2);
}
function formatSeconds(d, p2) {
  return pad(d.getSeconds(), p2, 2);
}
function formatWeekdayNumberMonday(d) {
  var day2 = d.getDay();
  return day2 === 0 ? 7 : day2;
}
function formatWeekNumberSunday(d, p2) {
  return pad(sunday.count(year(d) - 1, d), p2, 2);
}
function dISO(d) {
  var day2 = d.getDay();
  return day2 >= 4 || day2 === 0 ? thursday(d) : thursday.ceil(d);
}
function formatWeekNumberISO(d, p2) {
  d = dISO(d);
  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p2, 2);
}
function formatWeekdayNumberSunday(d) {
  return d.getDay();
}
function formatWeekNumberMonday(d, p2) {
  return pad(monday.count(year(d) - 1, d), p2, 2);
}
function formatYear(d, p2) {
  return pad(d.getFullYear() % 100, p2, 2);
}
function formatYearISO(d, p2) {
  d = dISO(d);
  return pad(d.getFullYear() % 100, p2, 2);
}
function formatFullYear(d, p2) {
  return pad(d.getFullYear() % 1e4, p2, 4);
}
function formatFullYearISO(d, p2) {
  var day2 = d.getDay();
  d = day2 >= 4 || day2 === 0 ? thursday(d) : thursday.ceil(d);
  return pad(d.getFullYear() % 1e4, p2, 4);
}
function formatZone(d) {
  var z2 = d.getTimezoneOffset();
  return (z2 > 0 ? "-" : (z2 *= -1, "+")) + pad(z2 / 60 | 0, "0", 2) + pad(z2 % 60, "0", 2);
}
function formatUTCDayOfMonth(d, p2) {
  return pad(d.getUTCDate(), p2, 2);
}
function formatUTCHour24(d, p2) {
  return pad(d.getUTCHours(), p2, 2);
}
function formatUTCHour12(d, p2) {
  return pad(d.getUTCHours() % 12 || 12, p2, 2);
}
function formatUTCDayOfYear(d, p2) {
  return pad(1 + utcDay.count(utcYear(d), d), p2, 3);
}
function formatUTCMilliseconds(d, p2) {
  return pad(d.getUTCMilliseconds(), p2, 3);
}
function formatUTCMicroseconds(d, p2) {
  return formatUTCMilliseconds(d, p2) + "000";
}
function formatUTCMonthNumber(d, p2) {
  return pad(d.getUTCMonth() + 1, p2, 2);
}
function formatUTCMinutes(d, p2) {
  return pad(d.getUTCMinutes(), p2, 2);
}
function formatUTCSeconds(d, p2) {
  return pad(d.getUTCSeconds(), p2, 2);
}
function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}
function formatUTCWeekNumberSunday(d, p2) {
  return pad(utcSunday.count(utcYear(d) - 1, d), p2, 2);
}
function UTCdISO(d) {
  var day2 = d.getUTCDay();
  return day2 >= 4 || day2 === 0 ? utcThursday(d) : utcThursday.ceil(d);
}
function formatUTCWeekNumberISO(d, p2) {
  d = UTCdISO(d);
  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p2, 2);
}
function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}
function formatUTCWeekNumberMonday(d, p2) {
  return pad(utcMonday.count(utcYear(d) - 1, d), p2, 2);
}
function formatUTCYear(d, p2) {
  return pad(d.getUTCFullYear() % 100, p2, 2);
}
function formatUTCYearISO(d, p2) {
  d = UTCdISO(d);
  return pad(d.getUTCFullYear() % 100, p2, 2);
}
function formatUTCFullYear(d, p2) {
  return pad(d.getUTCFullYear() % 1e4, p2, 4);
}
function formatUTCFullYearISO(d, p2) {
  var day2 = d.getUTCDay();
  d = day2 >= 4 || day2 === 0 ? utcThursday(d) : utcThursday.ceil(d);
  return pad(d.getUTCFullYear() % 1e4, p2, 4);
}
function formatUTCZone() {
  return "+0000";
}
function formatLiteralPercent() {
  return "%";
}
function formatUnixTimestamp(d) {
  return +d;
}
function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1e3);
}
var locale;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;
defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function defaultLocale(definition) {
  locale = formatLocale(definition);
  timeFormat = locale.format;
  timeParse = locale.parse;
  utcFormat = locale.utcFormat;
  utcParse = locale.utcParse;
  return locale;
}
function date(t2) {
  return new Date(t2);
}
function number(t2) {
  return t2 instanceof Date ? +t2 : +/* @__PURE__ */ new Date(+t2);
}
function calendar(ticks2, tickInterval, year2, month2, week, day2, hour2, minute2, second2, format2) {
  var scale = continuous(), invert = scale.invert, domain = scale.domain;
  var formatMillisecond = format2(".%L"), formatSecond = format2(":%S"), formatMinute = format2("%I:%M"), formatHour = format2("%I %p"), formatDay = format2("%a %d"), formatWeek = format2("%b %d"), formatMonth = format2("%B"), formatYear2 = format2("%Y");
  function tickFormat2(date2) {
    return (second2(date2) < date2 ? formatMillisecond : minute2(date2) < date2 ? formatSecond : hour2(date2) < date2 ? formatMinute : day2(date2) < date2 ? formatHour : month2(date2) < date2 ? week(date2) < date2 ? formatDay : formatWeek : year2(date2) < date2 ? formatMonth : formatYear2)(date2);
  }
  scale.invert = function(y2) {
    return new Date(invert(y2));
  };
  scale.domain = function(_2) {
    return arguments.length ? domain(Array.from(_2, number)) : domain().map(date);
  };
  scale.ticks = function(interval) {
    var d = domain();
    return ticks2(d[0], d[d.length - 1], interval == null ? 10 : interval);
  };
  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat2 : format2(specifier);
  };
  scale.nice = function(interval) {
    var d = domain();
    if (!interval || typeof interval.range !== "function") interval = tickInterval(d[0], d[d.length - 1], interval == null ? 10 : interval);
    return interval ? domain(nice(d, interval)) : scale;
  };
  scale.copy = function() {
    return copy(scale, calendar(ticks2, tickInterval, year2, month2, week, day2, hour2, minute2, second2, format2));
  };
  return scale;
}
function time() {
  return initRange.apply(calendar(timeTicks, timeTickInterval, timeYear, timeMonth, timeSunday, timeDay, timeHour, timeMinute, second$1, timeFormat).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function utcTime() {
  return initRange.apply(calendar(utcTicks, utcTickInterval, utcYear$1, utcMonth$1, utcSunday$1, utcDay$1, utcHour$1, utcMinute$1, second$1, utcFormat).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function colors(specifier) {
  var n2 = specifier.length / 6 | 0, colors2 = new Array(n2), i2 = 0;
  while (i2 < n2) colors2[i2] = "#" + specifier.slice(i2 * 6, ++i2 * 6);
  return colors2;
}
const e = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
const r = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");
const n = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");
const t = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");
const o = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");
const i = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");
const u$2 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");
const a = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");
const l = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");
const c$2 = colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");
const ramp$1 = (scheme2) => rgbBasis(scheme2[scheme2.length - 1]);
var scheme$q = new Array(3).concat(
  "d8b365f5f5f55ab4ac",
  "a6611adfc27d80cdc1018571",
  "a6611adfc27df5f5f580cdc1018571",
  "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
  "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
  "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
  "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
  "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
  "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
).map(colors);
const v$6 = ramp$1(scheme$q);
var scheme$p = new Array(3).concat(
  "af8dc3f7f7f77fbf7b",
  "7b3294c2a5cfa6dba0008837",
  "7b3294c2a5cff7f7f7a6dba0008837",
  "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
  "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
  "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
  "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
  "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
  "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
).map(colors);
const _$3 = ramp$1(scheme$p);
var scheme$o = new Array(3).concat(
  "e9a3c9f7f7f7a1d76a",
  "d01c8bf1b6dab8e1864dac26",
  "d01c8bf1b6daf7f7f7b8e1864dac26",
  "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
  "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
  "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
  "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
  "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
  "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
).map(colors);
const w$5 = ramp$1(scheme$o);
var scheme$n = new Array(3).concat(
  "998ec3f7f7f7f1a340",
  "5e3c99b2abd2fdb863e66101",
  "5e3c99b2abd2f7f7f7fdb863e66101",
  "542788998ec3d8daebfee0b6f1a340b35806",
  "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
  "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
  "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
  "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
  "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
).map(colors);
const k$5 = ramp$1(scheme$n);
var scheme$m = new Array(3).concat(
  "ef8a62f7f7f767a9cf",
  "ca0020f4a58292c5de0571b0",
  "ca0020f4a582f7f7f792c5de0571b0",
  "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
  "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
  "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
  "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
  "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
  "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
).map(colors);
const j$6 = ramp$1(scheme$m);
var scheme$l = new Array(3).concat(
  "ef8a62ffffff999999",
  "ca0020f4a582bababa404040",
  "ca0020f4a582ffffffbababa404040",
  "b2182bef8a62fddbc7e0e0e09999994d4d4d",
  "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
  "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
  "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
  "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
  "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
).map(colors);
const A$2 = ramp$1(scheme$l);
var scheme$k = new Array(3).concat(
  "fc8d59ffffbf91bfdb",
  "d7191cfdae61abd9e92c7bb6",
  "d7191cfdae61ffffbfabd9e92c7bb6",
  "d73027fc8d59fee090e0f3f891bfdb4575b4",
  "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
  "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
  "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
  "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
  "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
).map(colors);
const O$4 = ramp$1(scheme$k);
var scheme$j = new Array(3).concat(
  "fc8d59ffffbf91cf60",
  "d7191cfdae61a6d96a1a9641",
  "d7191cfdae61ffffbfa6d96a1a9641",
  "d73027fc8d59fee08bd9ef8b91cf601a9850",
  "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
  "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
  "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
  "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
  "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
).map(colors);
const z$4 = ramp$1(scheme$j);
var scheme$i = new Array(3).concat(
  "fc8d59ffffbf99d594",
  "d7191cfdae61abdda42b83ba",
  "d7191cfdae61ffffbfabdda42b83ba",
  "d53e4ffc8d59fee08be6f59899d5943288bd",
  "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
  "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
  "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
  "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
  "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
).map(colors);
const E$7 = ramp$1(scheme$i);
var scheme$h = new Array(3).concat(
  "e5f5f999d8c92ca25f",
  "edf8fbb2e2e266c2a4238b45",
  "edf8fbb2e2e266c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
).map(colors);
const ae$1 = ramp$1(scheme$h);
var scheme$g = new Array(3).concat(
  "e0ecf49ebcda8856a7",
  "edf8fbb3cde38c96c688419d",
  "edf8fbb3cde38c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
).map(colors);
const le$1 = ramp$1(scheme$g);
var scheme$f = new Array(3).concat(
  "e0f3dba8ddb543a2ca",
  "f0f9e8bae4bc7bccc42b8cbe",
  "f0f9e8bae4bc7bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
).map(colors);
const ce$1 = ramp$1(scheme$f);
var scheme$e = new Array(3).concat(
  "fee8c8fdbb84e34a33",
  "fef0d9fdcc8afc8d59d7301f",
  "fef0d9fdcc8afc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
).map(colors);
const se$1 = ramp$1(scheme$e);
var scheme$d = new Array(3).concat(
  "ece2f0a6bddb1c9099",
  "f6eff7bdc9e167a9cf02818a",
  "f6eff7bdc9e167a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
).map(colors);
const fe$1 = ramp$1(scheme$d);
var scheme$c = new Array(3).concat(
  "ece7f2a6bddb2b8cbe",
  "f1eef6bdc9e174a9cf0570b0",
  "f1eef6bdc9e174a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
).map(colors);
const pe$1 = ramp$1(scheme$c);
var scheme$b = new Array(3).concat(
  "e7e1efc994c7dd1c77",
  "f1eef6d7b5d8df65b0ce1256",
  "f1eef6d7b5d8df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
).map(colors);
const de$1 = ramp$1(scheme$b);
var scheme$a = new Array(3).concat(
  "fde0ddfa9fb5c51b8a",
  "feebe2fbb4b9f768a1ae017e",
  "feebe2fbb4b9f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
).map(colors);
const me$1 = ramp$1(scheme$a);
var scheme$9 = new Array(3).concat(
  "edf8b17fcdbb2c7fb8",
  "ffffcca1dab441b6c4225ea8",
  "ffffcca1dab441b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
).map(colors);
const he$1 = ramp$1(scheme$9);
var scheme$8 = new Array(3).concat(
  "f7fcb9addd8e31a354",
  "ffffccc2e69978c679238443",
  "ffffccc2e69978c67931a354006837",
  "ffffccd9f0a3addd8e78c67931a354006837",
  "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
).map(colors);
const ge$1 = ramp$1(scheme$8);
var scheme$7 = new Array(3).concat(
  "fff7bcfec44fd95f0e",
  "ffffd4fed98efe9929cc4c02",
  "ffffd4fed98efe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
).map(colors);
const ye = ramp$1(scheme$7);
var scheme$6 = new Array(3).concat(
  "ffeda0feb24cf03b20",
  "ffffb2fecc5cfd8d3ce31a1c",
  "ffffb2fecc5cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
).map(colors);
const be = ramp$1(scheme$6);
var scheme$5 = new Array(3).concat(
  "deebf79ecae13182bd",
  "eff3ffbdd7e76baed62171b5",
  "eff3ffbdd7e76baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
).map(colors);
const K$3 = ramp$1(scheme$5);
var scheme$4 = new Array(3).concat(
  "e5f5e0a1d99b31a354",
  "edf8e9bae4b374c476238b45",
  "edf8e9bae4b374c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
).map(colors);
const L$3 = ramp$1(scheme$4);
var scheme$3 = new Array(3).concat(
  "f0f0f0bdbdbd636363",
  "f7f7f7cccccc969696525252",
  "f7f7f7cccccc969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
).map(colors);
const N$6 = ramp$1(scheme$3);
var scheme$2 = new Array(3).concat(
  "efedf5bcbddc756bb1",
  "f2f0f7cbc9e29e9ac86a51a3",
  "f2f0f7cbc9e29e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
).map(colors);
const W$4 = ramp$1(scheme$2);
var scheme$1 = new Array(3).concat(
  "fee0d2fc9272de2d26",
  "fee5d9fcae91fb6a4acb181d",
  "fee5d9fcae91fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
).map(colors);
const X$5 = ramp$1(scheme$1);
var scheme = new Array(3).concat(
  "fee6cefdae6be6550d",
  "feeddefdbe85fd8d3cd94701",
  "feeddefdbe85fd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
).map(colors);
const Q$4 = ramp$1(scheme);
function te$1(t2) {
  t2 = Math.max(0, Math.min(1, t2));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(-4.54 - t2 * (35.34 - t2 * (2381.73 - t2 * (6402.7 - t2 * (7024.72 - t2 * 2710.57))))))) + ", " + Math.max(0, Math.min(255, Math.round(32.49 + t2 * (170.73 + t2 * (52.82 - t2 * (131.46 - t2 * (176.58 - t2 * 67.37))))))) + ", " + Math.max(0, Math.min(255, Math.round(81.24 + t2 * (442.36 - t2 * (2482.43 - t2 * (6167.24 - t2 * (6614.94 - t2 * 2475.67))))))) + ")";
}
const ue$1 = cubehelixLong(cubehelix$1(300, 0.5, 0), cubehelix$1(-240, 0.5, 1));
var warm = cubehelixLong(cubehelix$1(-100, 0.75, 0.35), cubehelix$1(80, 1.5, 0.8));
var cool = cubehelixLong(cubehelix$1(260, 0.75, 0.35), cubehelix$1(80, 1.5, 0.8));
var c$1 = cubehelix$1();
function ve$1(t2) {
  if (t2 < 0 || t2 > 1) t2 -= Math.floor(t2);
  var ts = Math.abs(t2 - 0.5);
  c$1.h = 360 * t2 - 100;
  c$1.s = 1.5 - 1.5 * ts;
  c$1.l = 0.8 - 0.9 * ts;
  return c$1 + "";
}
var c = rgb$1(), pi_1_3 = Math.PI / 3, pi_2_3 = Math.PI * 2 / 3;
function _e(t2) {
  var x2;
  t2 = (0.5 - t2) * Math.PI;
  c.r = 255 * (x2 = Math.sin(t2)) * x2;
  c.g = 255 * (x2 = Math.sin(t2 + pi_1_3)) * x2;
  c.b = 255 * (x2 = Math.sin(t2 + pi_2_3)) * x2;
  return c + "";
}
function Y$6(t2) {
  t2 = Math.max(0, Math.min(1, t2));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(34.61 + t2 * (1172.33 - t2 * (10793.56 - t2 * (33300.12 - t2 * (38394.49 - t2 * 14825.05))))))) + ", " + Math.max(0, Math.min(255, Math.round(23.31 + t2 * (557.33 + t2 * (1225.33 - t2 * (3574.96 - t2 * (1073.77 + t2 * 707.56))))))) + ", " + Math.max(0, Math.min(255, Math.round(27.2 + t2 * (3211.1 - t2 * (15327.97 - t2 * (27814 - t2 * (22569.18 - t2 * 6838.66))))))) + ")";
}
function ramp(range2) {
  var n2 = range2.length;
  return function(t2) {
    return range2[Math.max(0, Math.min(n2 - 1, Math.floor(t2 * n2)))];
  };
}
const Z$2 = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
function constant(x2) {
  return function constant2() {
    return x2;
  };
}
const abs = Math.abs;
const atan2 = Math.atan2;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const sqrt = Math.sqrt;
const epsilon$2 = 1e-12;
const pi$1 = Math.PI;
const halfPi = pi$1 / 2;
const tau$2 = 2 * pi$1;
function acos(x2) {
  return x2 > 1 ? 0 : x2 < -1 ? pi$1 : Math.acos(x2);
}
function asin(x2) {
  return x2 >= 1 ? halfPi : x2 <= -1 ? -halfPi : Math.asin(x2);
}
const pi = Math.PI, tau$1 = 2 * pi, epsilon$1 = 1e-6, tauEpsilon = tau$1 - epsilon$1;
function append(strings) {
  this._ += strings[0];
  for (let i2 = 1, n2 = strings.length; i2 < n2; ++i2) {
    this._ += arguments[i2] + strings[i2];
  }
}
function appendRound(digits) {
  let d = Math.floor(digits);
  if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
  if (d > 15) return append;
  const k2 = 10 ** d;
  return function(strings) {
    this._ += strings[0];
    for (let i2 = 1, n2 = strings.length; i2 < n2; ++i2) {
      this._ += Math.round(arguments[i2] * k2) / k2 + strings[i2];
    }
  };
}
let Path$1 = class Path {
  constructor(digits) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null;
    this._ = "";
    this._append = digits == null ? append : appendRound(digits);
  }
  moveTo(x2, y2) {
    this._append`M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x2, y2) {
    this._append`L${this._x1 = +x2},${this._y1 = +y2}`;
  }
  quadraticCurveTo(x1, y1, x2, y2) {
    this._append`Q${+x1},${+y1},${this._x1 = +x2},${this._y1 = +y2}`;
  }
  bezierCurveTo(x1, y1, x2, y2, x3, y3) {
    this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x3},${this._y1 = +y3}`;
  }
  arcTo(x1, y1, x2, y2, r2) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r2 = +r2;
    if (r2 < 0) throw new Error(`negative radius: ${r2}`);
    let x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    } else if (!(l01_2 > epsilon$1)) ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r2) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    } else {
      let x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l2 = r2 * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l2 / l01, t21 = l2 / l21;
      if (Math.abs(t01 - 1) > epsilon$1) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }
      this._append`A${r2},${r2},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x2, y2, r2, a0, a1, ccw) {
    x2 = +x2, y2 = +y2, r2 = +r2, ccw = !!ccw;
    if (r2 < 0) throw new Error(`negative radius: ${r2}`);
    let dx = r2 * Math.cos(a0), dy = r2 * Math.sin(a0), x0 = x2 + dx, y0 = y2 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    } else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
      this._append`L${x0},${y0}`;
    }
    if (!r2) return;
    if (da < 0) da = da % tau$1 + tau$1;
    if (da > tauEpsilon) {
      this._append`A${r2},${r2},0,1,${cw},${x2 - dx},${y2 - dy}A${r2},${r2},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    } else if (da > epsilon$1) {
      this._append`A${r2},${r2},0,${+(da >= pi)},${cw},${this._x1 = x2 + r2 * Math.cos(a1)},${this._y1 = y2 + r2 * Math.sin(a1)}`;
    }
  }
  rect(x2, y2, w2, h) {
    this._append`M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}h${w2 = +w2}v${+h}h${-w2}Z`;
  }
  toString() {
    return this._;
  }
};
function withPath(shape) {
  let digits = 3;
  shape.digits = function(_2) {
    if (!arguments.length) return digits;
    if (_2 == null) {
      digits = null;
    } else {
      const d = Math.floor(_2);
      if (!(d >= 0)) throw new RangeError(`invalid digits: ${_2}`);
      digits = d;
    }
    return shape;
  };
  return () => new Path$1(digits);
}
function arcInnerRadius(d) {
  return d.innerRadius;
}
function arcOuterRadius(d) {
  return d.outerRadius;
}
function arcStartAngle(d) {
  return d.startAngle;
}
function arcEndAngle(d) {
  return d.endAngle;
}
function arcPadAngle(d) {
  return d && d.padAngle;
}
function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0, x32 = x3 - x2, y32 = y3 - y2, t2 = y32 * x10 - x32 * y10;
  if (t2 * t2 < epsilon$2) return;
  t2 = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t2;
  return [x0 + t2 * x10, y0 + t2 * y10];
}
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1, y01 = y0 - y1, lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x11 = x0 + ox, y11 = y0 + oy, x10 = x1 + ox, y10 = y1 + oy, x00 = (x11 + x10) / 2, y00 = (y11 + y10) / 2, dx = x10 - x11, dy = y10 - y11, d2 = dx * dx + dy * dy, r2 = r1 - rc, D2 = x11 * y10 - x10 * y11, d = (dy < 0 ? -1 : 1) * sqrt(max(0, r2 * r2 * d2 - D2 * D2)), cx0 = (D2 * dy - dx * d) / d2, cy0 = (-D2 * dx - dy * d) / d2, cx1 = (D2 * dy + dx * d) / d2, cy1 = (-D2 * dx + dy * d) / d2, dx0 = cx0 - x00, dy0 = cy0 - y00, dx1 = cx1 - x00, dy1 = cy1 - y00;
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r2 - 1),
    y11: cy0 * (r1 / r2 - 1)
  };
}
function y$1() {
  var innerRadius = arcInnerRadius, outerRadius = arcOuterRadius, cornerRadius = constant(0), padRadius = null, startAngle = arcStartAngle, endAngle = arcEndAngle, padAngle = arcPadAngle, context = null, path = withPath(arc);
  function arc() {
    var buffer, r2, r0 = +innerRadius.apply(this, arguments), r1 = +outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) - halfPi, a1 = endAngle.apply(this, arguments) - halfPi, da = abs(a1 - a0), cw = a1 > a0;
    if (!context) context = buffer = path();
    if (r1 < r0) r2 = r1, r1 = r0, r0 = r2;
    if (!(r1 > epsilon$2)) context.moveTo(0, 0);
    else if (da > tau$2 - epsilon$2) {
      context.moveTo(r1 * cos(a0), r1 * sin(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon$2) {
        context.moveTo(r0 * cos(a1), r0 * sin(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    } else {
      var a01 = a0, a11 = a1, a00 = a0, a10 = a1, da0 = da, da1 = da, ap = padAngle.apply(this, arguments) / 2, rp = ap > epsilon$2 && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)), rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)), rc0 = rc, rc1 = rc, t02, t12;
      if (rp > epsilon$2) {
        var p0 = asin(rp / r0 * sin(ap)), p1 = asin(rp / r1 * sin(ap));
        if ((da0 -= p0 * 2) > epsilon$2) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon$2) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }
      var x01 = r1 * cos(a01), y01 = r1 * sin(a01), x10 = r0 * cos(a10), y10 = r0 * sin(a10);
      if (rc > epsilon$2) {
        var x11 = r1 * cos(a11), y11 = r1 * sin(a11), x00 = r0 * cos(a00), y00 = r0 * sin(a00), oc;
        if (da < pi$1) {
          if (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10)) {
            var ax = x01 - oc[0], ay = y01 - oc[1], bx = x11 - oc[0], by = y11 - oc[1], kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2), lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = min(rc, (r0 - lc) / (kc - 1));
            rc1 = min(rc, (r1 - lc) / (kc + 1));
          } else {
            rc0 = rc1 = 0;
          }
        }
      }
      if (!(da1 > epsilon$2)) context.moveTo(x01, y01);
      else if (rc1 > epsilon$2) {
        t02 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t12 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
        context.moveTo(t02.cx + t02.x01, t02.cy + t02.y01);
        if (rc1 < rc) context.arc(t02.cx, t02.cy, rc1, atan2(t02.y01, t02.x01), atan2(t12.y01, t12.x01), !cw);
        else {
          context.arc(t02.cx, t02.cy, rc1, atan2(t02.y01, t02.x01), atan2(t02.y11, t02.x11), !cw);
          context.arc(0, 0, r1, atan2(t02.cy + t02.y11, t02.cx + t02.x11), atan2(t12.cy + t12.y11, t12.cx + t12.x11), !cw);
          context.arc(t12.cx, t12.cy, rc1, atan2(t12.y11, t12.x11), atan2(t12.y01, t12.x01), !cw);
        }
      } else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);
      if (!(r0 > epsilon$2) || !(da0 > epsilon$2)) context.lineTo(x10, y10);
      else if (rc0 > epsilon$2) {
        t02 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t12 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
        context.lineTo(t02.cx + t02.x01, t02.cy + t02.y01);
        if (rc0 < rc) context.arc(t02.cx, t02.cy, rc0, atan2(t02.y01, t02.x01), atan2(t12.y01, t12.x01), !cw);
        else {
          context.arc(t02.cx, t02.cy, rc0, atan2(t02.y01, t02.x01), atan2(t02.y11, t02.x11), !cw);
          context.arc(0, 0, r0, atan2(t02.cy + t02.y11, t02.cx + t02.x11), atan2(t12.cy + t12.y11, t12.cx + t12.x11), cw);
          context.arc(t12.cx, t12.cy, rc0, atan2(t12.y11, t12.x11), atan2(t12.y01, t12.x01), !cw);
        }
      } else context.arc(0, 0, r0, a10, a00, cw);
    }
    context.closePath();
    if (buffer) return context = null, buffer + "" || null;
  }
  arc.centroid = function() {
    var r2 = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a2 = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [cos(a2) * r2, sin(a2) * r2];
  };
  arc.innerRadius = function(_2) {
    return arguments.length ? (innerRadius = typeof _2 === "function" ? _2 : constant(+_2), arc) : innerRadius;
  };
  arc.outerRadius = function(_2) {
    return arguments.length ? (outerRadius = typeof _2 === "function" ? _2 : constant(+_2), arc) : outerRadius;
  };
  arc.cornerRadius = function(_2) {
    return arguments.length ? (cornerRadius = typeof _2 === "function" ? _2 : constant(+_2), arc) : cornerRadius;
  };
  arc.padRadius = function(_2) {
    return arguments.length ? (padRadius = _2 == null ? null : typeof _2 === "function" ? _2 : constant(+_2), arc) : padRadius;
  };
  arc.startAngle = function(_2) {
    return arguments.length ? (startAngle = typeof _2 === "function" ? _2 : constant(+_2), arc) : startAngle;
  };
  arc.endAngle = function(_2) {
    return arguments.length ? (endAngle = typeof _2 === "function" ? _2 : constant(+_2), arc) : endAngle;
  };
  arc.padAngle = function(_2) {
    return arguments.length ? (padAngle = typeof _2 === "function" ? _2 : constant(+_2), arc) : padAngle;
  };
  arc.context = function(_2) {
    return arguments.length ? (context = _2 == null ? null : _2, arc) : context;
  };
  return arc;
}
function array(x2) {
  return typeof x2 === "object" && "length" in x2 ? x2 : Array.from(x2);
}
function Linear(context) {
  this._context = context;
}
Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(x2, y2);
        break;
    }
  }
};
function sr(context) {
  return new Linear(context);
}
function x$6(p2) {
  return p2[0];
}
function y(p2) {
  return p2[1];
}
function H$4(x2, y$12) {
  var defined = constant(true), context = null, curve = sr, output = null, path = withPath(line);
  x2 = typeof x2 === "function" ? x2 : x2 === void 0 ? x$6 : constant(x2);
  y$12 = typeof y$12 === "function" ? y$12 : y$12 === void 0 ? y : constant(y$12);
  function line(data) {
    var i2, n2 = (data = array(data)).length, d, defined0 = false, buffer;
    if (context == null) output = curve(buffer = path());
    for (i2 = 0; i2 <= n2; ++i2) {
      if (!(i2 < n2 && defined(d = data[i2], i2, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x2(d, i2, data), +y$12(d, i2, data));
    }
    if (buffer) return output = null, buffer + "" || null;
  }
  line.x = function(_2) {
    return arguments.length ? (x2 = typeof _2 === "function" ? _2 : constant(+_2), line) : x2;
  };
  line.y = function(_2) {
    return arguments.length ? (y$12 = typeof _2 === "function" ? _2 : constant(+_2), line) : y$12;
  };
  line.defined = function(_2) {
    return arguments.length ? (defined = typeof _2 === "function" ? _2 : constant(!!_2), line) : defined;
  };
  line.curve = function(_2) {
    return arguments.length ? (curve = _2, context != null && (output = curve(context)), line) : curve;
  };
  line.context = function(_2) {
    return arguments.length ? (_2 == null ? context = output = null : output = curve(context = _2), line) : context;
  };
  return line;
}
function Y$5(x0, y0, y1) {
  var x1 = null, defined = constant(true), context = null, curve = sr, output = null, path = withPath(area);
  x0 = typeof x0 === "function" ? x0 : x0 === void 0 ? x$6 : constant(+x0);
  y0 = typeof y0 === "function" ? y0 : y0 === void 0 ? constant(0) : constant(+y0);
  y1 = typeof y1 === "function" ? y1 : y1 === void 0 ? y : constant(+y1);
  function area(data) {
    var i2, j2, k2, n2 = (data = array(data)).length, d, defined0 = false, buffer, x0z = new Array(n2), y0z = new Array(n2);
    if (context == null) output = curve(buffer = path());
    for (i2 = 0; i2 <= n2; ++i2) {
      if (!(i2 < n2 && defined(d = data[i2], i2, data)) === defined0) {
        if (defined0 = !defined0) {
          j2 = i2;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k2 = i2 - 1; k2 >= j2; --k2) {
            output.point(x0z[k2], y0z[k2]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i2] = +x0(d, i2, data), y0z[i2] = +y0(d, i2, data);
        output.point(x1 ? +x1(d, i2, data) : x0z[i2], y1 ? +y1(d, i2, data) : y0z[i2]);
      }
    }
    if (buffer) return output = null, buffer + "" || null;
  }
  function arealine() {
    return H$4().defined(defined).curve(curve).context(context);
  }
  area.x = function(_2) {
    return arguments.length ? (x0 = typeof _2 === "function" ? _2 : constant(+_2), x1 = null, area) : x0;
  };
  area.x0 = function(_2) {
    return arguments.length ? (x0 = typeof _2 === "function" ? _2 : constant(+_2), area) : x0;
  };
  area.x1 = function(_2) {
    return arguments.length ? (x1 = _2 == null ? null : typeof _2 === "function" ? _2 : constant(+_2), area) : x1;
  };
  area.y = function(_2) {
    return arguments.length ? (y0 = typeof _2 === "function" ? _2 : constant(+_2), y1 = null, area) : y0;
  };
  area.y0 = function(_2) {
    return arguments.length ? (y0 = typeof _2 === "function" ? _2 : constant(+_2), area) : y0;
  };
  area.y1 = function(_2) {
    return arguments.length ? (y1 = _2 == null ? null : typeof _2 === "function" ? _2 : constant(+_2), area) : y1;
  };
  area.lineX0 = area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };
  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };
  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };
  area.defined = function(_2) {
    return arguments.length ? (defined = typeof _2 === "function" ? _2 : constant(!!_2), area) : defined;
  };
  area.curve = function(_2) {
    return arguments.length ? (curve = _2, context != null && (output = curve(context)), area) : curve;
  };
  area.context = function(_2) {
    return arguments.length ? (_2 == null ? context = output = null : output = curve(context = _2), area) : context;
  };
  return area;
}
function descending(a2, b2) {
  return b2 < a2 ? -1 : b2 > a2 ? 1 : b2 >= a2 ? 0 : NaN;
}
function identity(d) {
  return d;
}
function T$7() {
  var value = identity, sortValues = descending, sort = null, startAngle = constant(0), endAngle = constant(tau$2), padAngle = constant(0);
  function pie(data) {
    var i2, n2 = (data = array(data)).length, j2, k2, sum = 0, index = new Array(n2), arcs = new Array(n2), a0 = +startAngle.apply(this, arguments), da = Math.min(tau$2, Math.max(-tau$2, endAngle.apply(this, arguments) - a0)), a1, p2 = Math.min(Math.abs(da) / n2, padAngle.apply(this, arguments)), pa = p2 * (da < 0 ? -1 : 1), v2;
    for (i2 = 0; i2 < n2; ++i2) {
      if ((v2 = arcs[index[i2] = i2] = +value(data[i2], i2, data)) > 0) {
        sum += v2;
      }
    }
    if (sortValues != null) index.sort(function(i3, j3) {
      return sortValues(arcs[i3], arcs[j3]);
    });
    else if (sort != null) index.sort(function(i3, j3) {
      return sort(data[i3], data[j3]);
    });
    for (i2 = 0, k2 = sum ? (da - n2 * pa) / sum : 0; i2 < n2; ++i2, a0 = a1) {
      j2 = index[i2], v2 = arcs[j2], a1 = a0 + (v2 > 0 ? v2 * k2 : 0) + pa, arcs[j2] = {
        data: data[j2],
        index: i2,
        value: v2,
        startAngle: a0,
        endAngle: a1,
        padAngle: p2
      };
    }
    return arcs;
  }
  pie.value = function(_2) {
    return arguments.length ? (value = typeof _2 === "function" ? _2 : constant(+_2), pie) : value;
  };
  pie.sortValues = function(_2) {
    return arguments.length ? (sortValues = _2, sort = null, pie) : sortValues;
  };
  pie.sort = function(_2) {
    return arguments.length ? (sort = _2, sortValues = null, pie) : sort;
  };
  pie.startAngle = function(_2) {
    return arguments.length ? (startAngle = typeof _2 === "function" ? _2 : constant(+_2), pie) : startAngle;
  };
  pie.endAngle = function(_2) {
    return arguments.length ? (endAngle = typeof _2 === "function" ? _2 : constant(+_2), pie) : endAngle;
  };
  pie.padAngle = function(_2) {
    return arguments.length ? (padAngle = typeof _2 === "function" ? _2 : constant(+_2), pie) : padAngle;
  };
  return pie;
}
function noop() {
}
function point$3(that, x2, y2) {
  that._context.bezierCurveTo(
    (2 * that._x0 + that._x1) / 3,
    (2 * that._y0 + that._y1) / 3,
    (that._x0 + 2 * that._x1) / 3,
    (that._y0 + 2 * that._y1) / 3,
    (that._x0 + 4 * that._x1 + x2) / 6,
    (that._y0 + 4 * that._y1 + y2) / 6
  );
}
function Basis(context) {
  this._context = context;
}
Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        point$3(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        point$3(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function $e$3(context) {
  return new Basis(context);
}
function BasisClosed(context) {
  this._context = context;
}
BasisClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
        this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2);
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x2 = x2, this._y2 = y2;
        break;
      case 1:
        this._point = 2;
        this._x3 = x2, this._y3 = y2;
        break;
      case 2:
        this._point = 3;
        this._x4 = x2, this._y4 = y2;
        this._context.moveTo((this._x0 + 4 * this._x1 + x2) / 6, (this._y0 + 4 * this._y1 + y2) / 6);
        break;
      default:
        point$3(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function er(context) {
  return new BasisClosed(context);
}
function BasisOpen(context) {
  this._context = context;
}
BasisOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var x0 = (this._x0 + 4 * this._x1 + x2) / 6, y0 = (this._y0 + 4 * this._y1 + y2) / 6;
        this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
        break;
      case 3:
        this._point = 4;
      default:
        point$3(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function rr(context) {
  return new BasisOpen(context);
}
function Bundle(context, beta) {
  this._basis = new Basis(context);
  this._beta = beta;
}
Bundle.prototype = {
  lineStart: function() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function() {
    var x2 = this._x, y2 = this._y, j2 = x2.length - 1;
    if (j2 > 0) {
      var x0 = x2[0], y0 = y2[0], dx = x2[j2] - x0, dy = y2[j2] - y0, i2 = -1, t2;
      while (++i2 <= j2) {
        t2 = i2 / j2;
        this._basis.point(
          this._beta * x2[i2] + (1 - this._beta) * (x0 + t2 * dx),
          this._beta * y2[i2] + (1 - this._beta) * (y0 + t2 * dy)
        );
      }
    }
    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function(x2, y2) {
    this._x.push(+x2);
    this._y.push(+y2);
  }
};
const tr = function custom(beta) {
  function bundle(context) {
    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
  }
  bundle.beta = function(beta2) {
    return custom(+beta2);
  };
  return bundle;
}(0.85);
function point$2(that, x2, y2) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x2),
    that._y2 + that._k * (that._y1 - y2),
    that._x2,
    that._y2
  );
}
function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}
Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        point$2(this, this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        this._x1 = x2, this._y1 = y2;
        break;
      case 2:
        this._point = 3;
      default:
        point$2(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
const nr = function custom2(tension) {
  function cardinal(context) {
    return new Cardinal(context, tension);
  }
  cardinal.tension = function(tension2) {
    return custom2(+tension2);
  };
  return cardinal;
}(0);
function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}
CardinalClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x2, this._y3 = y2;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo(this._x4 = x2, this._y4 = y2);
        break;
      case 2:
        this._point = 3;
        this._x5 = x2, this._y5 = y2;
        break;
      default:
        point$2(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
const ir = function custom3(tension) {
  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }
  cardinal.tension = function(tension2) {
    return custom3(+tension2);
  };
  return cardinal;
}(0);
function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}
CardinalOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        point$2(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
const or = function custom4(tension) {
  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }
  cardinal.tension = function(tension2) {
    return custom4(+tension2);
  };
  return cardinal;
}(0);
function point$1(that, x2, y2) {
  var x1 = that._x1, y1 = that._y1, x22 = that._x2, y22 = that._y2;
  if (that._l01_a > epsilon$2) {
    var a2 = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a, n2 = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a2 - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n2;
    y1 = (y1 * a2 - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n2;
  }
  if (that._l23_a > epsilon$2) {
    var b2 = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a, m2 = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x22 = (x22 * b2 + that._x1 * that._l23_2a - x2 * that._l12_2a) / m2;
    y22 = (y22 * b2 + that._y1 * that._l23_2a - y2 * that._l12_2a) / m2;
  }
  that._context.bezierCurveTo(x1, y1, x22, y22, that._x2, that._y2);
}
function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}
CatmullRom.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) {
      var x23 = this._x2 - x2, y23 = this._y2 - y2;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        point$1(this, x2, y2);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
const lr = function custom5(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom5(+alpha2);
  };
  return catmullRom;
}(0.5);
function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}
CatmullRomClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) {
      var x23 = this._x2 - x2, y23 = this._y2 - y2;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x2, this._y3 = y2;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo(this._x4 = x2, this._y4 = y2);
        break;
      case 2:
        this._point = 3;
        this._x5 = x2, this._y5 = y2;
        break;
      default:
        point$1(this, x2, y2);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
const ar = function custom6(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom6(+alpha2);
  };
  return catmullRom;
}(0.5);
function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}
CatmullRomOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) {
      var x23 = this._x2 - x2, y23 = this._y2 - y2;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        point$1(this, x2, y2);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
const dr = function custom7(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom7(+alpha2);
  };
  return catmullRom;
}(0.5);
function LinearClosed(context) {
  this._context = context;
}
LinearClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._point) this._context.closePath();
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) this._context.lineTo(x2, y2);
    else this._point = 1, this._context.moveTo(x2, y2);
  }
};
function ur(context) {
  return new LinearClosed(context);
}
function sign(x2) {
  return x2 < 0 ? -1 : 1;
}
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0), p2 = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p2)) || 0;
}
function slope2(that, t2) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t2) / 2 : t2;
}
function point(that, t02, t12) {
  var x0 = that._x0, y0 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t02, x1 - dx, y1 - dx * t12, x1, y1);
}
function MonotoneX(context) {
  this._context = context;
}
MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        point(this, this._t0, slope2(this, this._t0));
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    var t12 = NaN;
    x2 = +x2, y2 = +y2;
    if (x2 === this._x1 && y2 === this._y1) return;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        point(this, slope2(this, t12 = slope3(this, x2, y2)), t12);
        break;
      default:
        point(this, this._t0, t12 = slope3(this, x2, y2));
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
    this._t0 = t12;
  }
};
function MonotoneY(context) {
  this._context = new ReflectContext(context);
}
(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x2, y2) {
  MonotoneX.prototype.point.call(this, y2, x2);
};
function ReflectContext(context) {
  this._context = context;
}
ReflectContext.prototype = {
  moveTo: function(x2, y2) {
    this._context.moveTo(y2, x2);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(x2, y2) {
    this._context.lineTo(y2, x2);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y3, x3);
  }
};
function monotoneX(context) {
  return new MonotoneX(context);
}
function monotoneY(context) {
  return new MonotoneY(context);
}
function Natural(context) {
  this._context = context;
}
Natural.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [];
    this._y = [];
  },
  lineEnd: function() {
    var x2 = this._x, y2 = this._y, n2 = x2.length;
    if (n2) {
      this._line ? this._context.lineTo(x2[0], y2[0]) : this._context.moveTo(x2[0], y2[0]);
      if (n2 === 2) {
        this._context.lineTo(x2[1], y2[1]);
      } else {
        var px = controlPoints(x2), py = controlPoints(y2);
        for (var i0 = 0, i1 = 1; i1 < n2; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x2[i1], y2[i1]);
        }
      }
    }
    if (this._line || this._line !== 0 && n2 === 1) this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function(x2, y2) {
    this._x.push(+x2);
    this._y.push(+y2);
  }
};
function controlPoints(x2) {
  var i2, n2 = x2.length - 1, m2, a2 = new Array(n2), b2 = new Array(n2), r2 = new Array(n2);
  a2[0] = 0, b2[0] = 2, r2[0] = x2[0] + 2 * x2[1];
  for (i2 = 1; i2 < n2 - 1; ++i2) a2[i2] = 1, b2[i2] = 4, r2[i2] = 4 * x2[i2] + 2 * x2[i2 + 1];
  a2[n2 - 1] = 2, b2[n2 - 1] = 7, r2[n2 - 1] = 8 * x2[n2 - 1] + x2[n2];
  for (i2 = 1; i2 < n2; ++i2) m2 = a2[i2] / b2[i2 - 1], b2[i2] -= m2, r2[i2] -= m2 * r2[i2 - 1];
  a2[n2 - 1] = r2[n2 - 1] / b2[n2 - 1];
  for (i2 = n2 - 2; i2 >= 0; --i2) a2[i2] = (r2[i2] - a2[i2 + 1]) / b2[i2];
  b2[n2 - 1] = (x2[n2] + a2[n2 - 1]) / 2;
  for (i2 = 0; i2 < n2 - 1; ++i2) b2[i2] = 2 * x2[i2 + 1] - a2[i2 + 1];
  return [a2, b2];
}
function pr$2(context) {
  return new Natural(context);
}
function Step(context, t2) {
  this._context = context;
  this._t = t2;
}
Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) {
          this._context.lineTo(this._x, y2);
          this._context.lineTo(x2, y2);
        } else {
          var x1 = this._x * (1 - this._t) + x2 * this._t;
          this._context.lineTo(x1, this._y);
          this._context.lineTo(x1, y2);
        }
        break;
      }
    }
    this._x = x2, this._y = y2;
  }
};
function hr(context) {
  return new Step(context, 0.5);
}
function stepBefore(context) {
  return new Step(context, 0);
}
function stepAfter(context) {
  return new Step(context, 1);
}
var Pr$1 = { background: "transparent", text: { fontFamily: "sans-serif", fontSize: 11, fill: "#333333", outlineWidth: 0, outlineColor: "transparent", outlineOpacity: 1 }, axis: { domain: { line: { stroke: "transparent", strokeWidth: 1 } }, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: {} }, legend: { text: { fontSize: 12 } } }, grid: { line: { stroke: "#dddddd", strokeWidth: 1 } }, legends: { hidden: { symbol: { fill: "#333333", opacity: 0.6 }, text: { fill: "#333333", opacity: 0.6 } }, text: {}, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: { fontSize: 10 } }, title: { text: {} } }, labels: { text: {} }, markers: { lineColor: "#000000", lineStrokeWidth: 1, text: {} }, dots: { text: {} }, tooltip: { container: { background: "white", color: "inherit", fontSize: "inherit", borderRadius: "2px", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)", padding: "5px 9px" }, basic: { whiteSpace: "pre", display: "flex", alignItems: "center" }, chip: { marginRight: 7 }, table: {}, tableCell: { padding: "3px 5px" }, tableCellValue: { fontWeight: "bold" } }, crosshair: { line: { stroke: "#000000", strokeWidth: 1, strokeOpacity: 0.75, strokeDasharray: "6 6" } }, annotations: { text: { fontSize: 13, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, link: { stroke: "#000000", strokeWidth: 1, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, outline: { fill: "none", stroke: "#000000", strokeWidth: 2, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, symbol: { fill: "#000000", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 } } };
function jr$2() {
  return jr$2 = Object.assign ? Object.assign.bind() : function(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = arguments[r2];
      for (var n2 in t2) Object.prototype.hasOwnProperty.call(t2, n2) && (e3[n2] = t2[n2]);
    }
    return e3;
  }, jr$2.apply(this, arguments);
}
function Br$2(e3, r2) {
  if (null == e3) return {};
  var t2, n2, i2 = {}, o2 = Object.keys(e3);
  for (n2 = 0; n2 < o2.length; n2++) t2 = o2[n2], r2.indexOf(t2) >= 0 || (i2[t2] = e3[t2]);
  return i2;
}
var Gr$1 = ["axis.ticks.text", "axis.legend.text", "legends.title.text", "legends.text", "legends.ticks.text", "legends.title.text", "labels.text", "dots.text", "markers.text", "annotations.text"], Lr$1 = function(e3, r2) {
  return jr$2({}, r2, e3);
}, Ir$1 = function(e3, r2) {
  var t2 = m$7({}, e3, r2);
  return Gr$1.forEach(function(e4) {
    v$8(t2, e4, Lr$1(y$2(t2, e4), t2.text));
  }), t2;
}, Yr$2 = createContext(), Ar$1 = function(e3) {
  var t2 = e3.children, n2 = e3.animate, i2 = void 0 === n2 || n2, o2 = e3.config, l2 = void 0 === o2 ? "default" : o2, a2 = useMemo(function() {
    var e4 = O$6(l2) ? config[l2] : l2;
    return { animate: i2, config: e4 };
  }, [i2, l2]);
  return jsx(Yr$2.Provider, { value: a2, children: t2 });
}, Er$2 = { animate: c$3.bool, motionConfig: c$3.oneOfType([c$3.oneOf(Object.keys(config)), c$3.shape({ mass: c$3.number, tension: c$3.number, friction: c$3.number, clamp: c$3.bool, precision: c$3.number, velocity: c$3.number, duration: c$3.number, easing: c$3.func })]) };
Ar$1.propTypes = { children: c$3.node.isRequired, animate: Er$2.animate, config: Er$2.motionConfig };
var Ur$2 = function() {
  return useContext(Yr$2);
}, Xr$2 = { nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"], BrBG: W$5(scheme$q), PRGn: W$5(scheme$p), PiYG: W$5(scheme$o), PuOr: W$5(scheme$n), RdBu: W$5(scheme$m), RdGy: W$5(scheme$l), RdYlBu: W$5(scheme$k), RdYlGn: W$5(scheme$j), spectral: W$5(scheme$i), blues: W$5(scheme$5), greens: W$5(scheme$4), greys: W$5(scheme$3), oranges: W$5(scheme), purples: W$5(scheme$2), reds: W$5(scheme$1), BuGn: W$5(scheme$h), BuPu: W$5(scheme$g), GnBu: W$5(scheme$f), OrRd: W$5(scheme$e), PuBuGn: W$5(scheme$d), PuBu: W$5(scheme$c), PuRd: W$5(scheme$b), RdPu: W$5(scheme$a), YlGnBu: W$5(scheme$9), YlGn: W$5(scheme$8), YlOrBr: W$5(scheme$7), YlOrRd: W$5(scheme$6) }, Nr$2 = Object.keys(Xr$2);
({ nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: e, accent: r, dark2: n, paired: t, pastel1: o, pastel2: i, set1: u$2, set2: a, set3: l, brown_blueGreen: W$5(scheme$q), purpleRed_green: W$5(scheme$p), pink_yellowGreen: W$5(scheme$o), purple_orange: W$5(scheme$n), red_blue: W$5(scheme$m), red_grey: W$5(scheme$l), red_yellow_blue: W$5(scheme$k), red_yellow_green: W$5(scheme$j), spectral: W$5(scheme$i), blues: W$5(scheme$5), greens: W$5(scheme$4), greys: W$5(scheme$3), oranges: W$5(scheme), purples: W$5(scheme$2), reds: W$5(scheme$1), blue_green: W$5(scheme$h), blue_purple: W$5(scheme$g), green_blue: W$5(scheme$f), orange_red: W$5(scheme$e), purple_blue_green: W$5(scheme$d), purple_blue: W$5(scheme$c), purple_red: W$5(scheme$b), red_purple: W$5(scheme$a), yellow_green_blue: W$5(scheme$9), yellow_green: W$5(scheme$8), yellow_orange_brown: W$5(scheme$7), yellow_orange_red: W$5(scheme$6) });
c$3.oneOfType([c$3.oneOf(Nr$2), c$3.func, c$3.arrayOf(c$3.string)]);
var rt$3 = { basis: $e$3, basisClosed: er, basisOpen: rr, bundle: tr, cardinal: nr, cardinalClosed: ir, cardinalOpen: or, catmullRom: lr, catmullRomClosed: ar, catmullRomOpen: dr, linear: sr, linearClosed: ur, monotoneX, monotoneY, natural: pr$2, step: hr, stepAfter, stepBefore }, tt$3 = Object.keys(rt$3);
tt$3.filter(function(e3) {
  return e3.endsWith("Closed");
});
Ze(tt$3, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
Ze(tt$3, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
c$3.shape({ top: c$3.number, right: c$3.number, bottom: c$3.number, left: c$3.number }).isRequired;
var ht$2 = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
c$3.oneOf(ht$2);
ordinal(l);
var _t$1 = { top: 0, right: 0, bottom: 0, left: 0 }, wt$1 = function(e3, t2, n2) {
  return void 0 === n2 && (n2 = {}), useMemo(function() {
    var r2 = jr$2({}, _t$1, n2);
    return { margin: r2, innerWidth: e3 - r2.left - r2.right, innerHeight: t2 - r2.top - r2.bottom, outerWidth: e3, outerHeight: t2 };
  }, [e3, t2, n2.top, n2.right, n2.bottom, n2.left]);
}, kt$2 = function() {
  var e3 = useRef(null), r2 = useState({ left: 0, top: 0, width: 0, height: 0 }), t2 = r2[0], l2 = r2[1], a2 = useState(function() {
    return "undefined" == typeof ResizeObserver ? null : new ResizeObserver(function(e4) {
      var r3 = e4[0];
      return l2(r3.contentRect);
    });
  })[0];
  return useEffect(function() {
    return e3.current && null !== a2 && a2.observe(e3.current), function() {
      null !== a2 && a2.disconnect();
    };
  }, []), [e3, t2];
}, Rt$1 = function(e3) {
  return useMemo(function() {
    return Ir$1(Pr$1, e3);
  }, [e3]);
}, xt$2 = function(e3) {
  return "function" == typeof e3 ? e3 : "string" == typeof e3 ? 0 === e3.indexOf("time:") ? timeFormat(e3.slice("5")) : format(e3) : function(e4) {
    return "" + e4;
  };
}, Ot$2 = function(e3) {
  return useMemo(function() {
    return xt$2(e3);
  }, [e3]);
}, qt$2 = createContext(), Ct$1 = {}, Wt$1 = function(e3) {
  var r2 = e3.theme, t2 = void 0 === r2 ? Ct$1 : r2, n2 = e3.children, i2 = Rt$1(t2);
  return jsx(qt$2.Provider, { value: i2, children: n2 });
};
Wt$1.propTypes = { children: c$3.node.isRequired, theme: c$3.object };
var zt$2 = function() {
  return useContext(qt$2);
}, Tt$2 = ["outlineWidth", "outlineColor", "outlineOpacity"], Mt$2 = function(e3) {
  return e3.outlineWidth, e3.outlineColor, e3.outlineOpacity, Br$2(e3, Tt$2);
}, Pt$1 = function(e3) {
  var r2 = e3.children, t2 = e3.condition, n2 = e3.wrapper;
  return t2 ? cloneElement(n2, {}, r2) : r2;
};
Pt$1.propTypes = { children: c$3.node.isRequired, condition: c$3.bool.isRequired, wrapper: c$3.element.isRequired };
var jt$1 = { position: "relative" }, St$1 = function(e3) {
  var r2 = e3.children, t2 = e3.theme, i2 = e3.renderWrapper, o2 = void 0 === i2 || i2, l2 = e3.isInteractive, a2 = void 0 === l2 || l2, d = e3.animate, s = e3.motionConfig, u2 = useRef(null);
  return jsx(Wt$1, { theme: t2, children: jsx(Ar$1, { animate: d, config: s, children: jsx(M$2, { container: u2, children: jsxs(Pt$1, { condition: o2, wrapper: jsx("div", { style: jt$1, ref: u2 }), children: [r2, a2 && jsx(F$2, {})] }) }) }) });
};
St$1.propTypes = { children: c$3.element.isRequired, isInteractive: c$3.bool, renderWrapper: c$3.bool, theme: c$3.object, animate: c$3.bool, motionConfig: c$3.oneOfType([c$3.string, Er$2.motionConfig]) };
({ children: c$3.func.isRequired, isInteractive: c$3.bool, renderWrapper: c$3.bool, theme: c$3.object.isRequired, animate: c$3.bool.isRequired, motionConfig: c$3.oneOfType([c$3.string, Er$2.motionConfig]) });
var It$1 = function(e3) {
  var r2 = e3.children, t2 = kt$2(), n2 = t2[0], i2 = t2[1], o2 = i2.width > 0 && i2.height > 0;
  return jsx("div", { ref: n2, style: { width: "100%", height: "100%" }, children: o2 && r2({ width: i2.width, height: i2.height }) });
};
It$1.propTypes = { children: c$3.func.isRequired };
var Yt$2 = ["id", "colors"], Dt$2 = function(e3) {
  var r2 = e3.id, t2 = e3.colors, n2 = Br$2(e3, Yt$2);
  return jsx("linearGradient", jr$2({ id: r2, x1: 0, x2: 0, y1: 0, y2: 1 }, n2, { children: t2.map(function(e4) {
    var r3 = e4.offset, t3 = e4.color, n3 = e4.opacity;
    return jsx("stop", { offset: r3 + "%", stopColor: t3, stopOpacity: void 0 !== n3 ? n3 : 1 }, r3);
  }) }));
};
Dt$2.propTypes = { id: c$3.string.isRequired, colors: c$3.arrayOf(c$3.shape({ offset: c$3.number.isRequired, color: c$3.string.isRequired, opacity: c$3.number })).isRequired, gradientTransform: c$3.string };
var Et$2 = { linearGradient: Dt$2 }, Ut$2 = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false }, Ft$2 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.background, n2 = void 0 === t2 ? Ut$2.background : t2, i2 = e3.color, o2 = void 0 === i2 ? Ut$2.color : i2, l2 = e3.size, a2 = void 0 === l2 ? Ut$2.size : l2, d = e3.padding, s = void 0 === d ? Ut$2.padding : d, u2 = e3.stagger, c2 = void 0 === u2 ? Ut$2.stagger : u2, f2 = a2 + s, p2 = a2 / 2, h = s / 2;
  return true === c2 && (f2 = 2 * a2 + 2 * s), jsxs("pattern", { id: r2, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: f2, height: f2, fill: n2 }), jsx("circle", { cx: h + p2, cy: h + p2, r: p2, fill: o2 }), c2 && jsx("circle", { cx: 1.5 * s + a2 + p2, cy: 1.5 * s + a2 + p2, r: p2, fill: o2 })] });
});
Ft$2.displayName = "PatternDots", Ft$2.propTypes = { id: c$3.string.isRequired, color: c$3.string.isRequired, background: c$3.string.isRequired, size: c$3.number.isRequired, padding: c$3.number.isRequired, stagger: c$3.bool.isRequired };
var Ht$2 = function(e3) {
  return e3 * Math.PI / 180;
}, Kt$1 = function(e3) {
  return 180 * e3 / Math.PI;
}, nn$3 = { spacing: 5, rotation: 0, background: "#000000", color: "#ffffff", lineWidth: 2 }, on$3 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.spacing, n2 = void 0 === t2 ? nn$3.spacing : t2, i2 = e3.rotation, o2 = void 0 === i2 ? nn$3.rotation : i2, l2 = e3.background, a2 = void 0 === l2 ? nn$3.background : l2, d = e3.color, s = void 0 === d ? nn$3.color : d, u2 = e3.lineWidth, c2 = void 0 === u2 ? nn$3.lineWidth : u2, f2 = Math.round(o2) % 360, p2 = Math.abs(n2);
  f2 > 180 ? f2 -= 360 : f2 > 90 ? f2 -= 180 : f2 < -180 ? f2 += 360 : f2 < -90 && (f2 += 180);
  var h, g2 = p2, b2 = p2;
  return 0 === f2 ? h = "\n                M 0 0 L " + g2 + " 0\n                M 0 " + b2 + " L " + g2 + " " + b2 + "\n            " : 90 === f2 ? h = "\n                M 0 0 L 0 " + b2 + "\n                M " + g2 + " 0 L " + g2 + " " + b2 + "\n            " : (g2 = Math.abs(p2 / Math.sin(Ht$2(f2))), b2 = p2 / Math.sin(Ht$2(90 - f2)), h = f2 > 0 ? "\n                    M 0 " + -b2 + " L " + 2 * g2 + " " + b2 + "\n                    M " + -g2 + " " + -b2 + " L " + g2 + " " + b2 + "\n                    M " + -g2 + " 0 L " + g2 + " " + 2 * b2 + "\n                " : "\n                    M " + -g2 + " " + b2 + " L " + g2 + " " + -b2 + "\n                    M " + -g2 + " " + 2 * b2 + " L " + 2 * g2 + " " + -b2 + "\n                    M 0 " + 2 * b2 + " L " + 2 * g2 + " 0\n                "), jsxs("pattern", { id: r2, width: g2, height: b2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: g2, height: b2, fill: a2, stroke: "rgba(255, 0, 0, 0.1)", strokeWidth: 0 }), jsx("path", { d: h, strokeWidth: c2, stroke: s, strokeLinecap: "square" })] });
});
on$3.displayName = "PatternLines", on$3.propTypes = { id: c$3.string.isRequired, spacing: c$3.number.isRequired, rotation: c$3.number.isRequired, background: c$3.string.isRequired, color: c$3.string.isRequired, lineWidth: c$3.number.isRequired };
var an$3 = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false }, dn$3 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.color, n2 = void 0 === t2 ? an$3.color : t2, i2 = e3.background, o2 = void 0 === i2 ? an$3.background : i2, l2 = e3.size, a2 = void 0 === l2 ? an$3.size : l2, d = e3.padding, s = void 0 === d ? an$3.padding : d, u2 = e3.stagger, c2 = void 0 === u2 ? an$3.stagger : u2, f2 = a2 + s, p2 = s / 2;
  return true === c2 && (f2 = 2 * a2 + 2 * s), jsxs("pattern", { id: r2, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: f2, height: f2, fill: o2 }), jsx("rect", { x: p2, y: p2, width: a2, height: a2, fill: n2 }), c2 && jsx("rect", { x: 1.5 * s + a2, y: 1.5 * s + a2, width: a2, height: a2, fill: n2 })] });
});
dn$3.displayName = "PatternSquares", dn$3.propTypes = { id: c$3.string.isRequired, color: c$3.string.isRequired, background: c$3.string.isRequired, size: c$3.number.isRequired, padding: c$3.number.isRequired, stagger: c$3.bool.isRequired };
var un$3 = { patternDots: Ft$2, patternLines: on$3, patternSquares: dn$3 }, cn$3 = ["type"], fn$3 = jr$2({}, Et$2, un$3), pn$3 = function(e3) {
  var r2 = e3.defs;
  return !r2 || r2.length < 1 ? null : jsx("defs", { "aria-hidden": true, children: r2.map(function(e4) {
    var r3 = e4.type, t2 = Br$2(e4, cn$3);
    return fn$3[r3] ? createElement(fn$3[r3], jr$2({ key: t2.id }, t2)) : null;
  }) });
};
pn$3.propTypes = { defs: c$3.arrayOf(c$3.shape({ type: c$3.oneOf(Object.keys(fn$3)).isRequired, id: c$3.string.isRequired })) };
var hn$2 = memo(pn$3), gn$2 = function(e3) {
  var r2 = e3.width, t2 = e3.height, n2 = e3.margin, i2 = e3.defs, o2 = e3.children, l2 = e3.role, a2 = e3.ariaLabel, d = e3.ariaLabelledBy, s = e3.ariaDescribedBy, u2 = e3.isFocusable, c2 = zt$2();
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: r2, height: t2, role: l2, "aria-label": a2, "aria-labelledby": d, "aria-describedby": s, focusable: u2, tabIndex: u2 ? 0 : void 0, children: [jsx(hn$2, { defs: i2 }), jsx("rect", { width: r2, height: t2, fill: c2.background }), jsx("g", { transform: "translate(" + n2.left + "," + n2.top + ")", children: o2 })] });
};
gn$2.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, margin: c$3.shape({ top: c$3.number.isRequired, left: c$3.number.isRequired }).isRequired, defs: c$3.array, children: c$3.oneOfType([c$3.arrayOf(c$3.node), c$3.node]).isRequired, role: c$3.string, isFocusable: c$3.bool, ariaLabel: c$3.string, ariaLabelledBy: c$3.string, ariaDescribedBy: c$3.string };
var bn$2 = function(e3) {
  var r2 = e3.size, t2 = e3.color, n2 = e3.borderWidth, i2 = e3.borderColor;
  return jsx("circle", { r: r2 / 2, fill: t2, stroke: i2, strokeWidth: n2, style: { pointerEvents: "none" } });
};
bn$2.propTypes = { size: c$3.number.isRequired, color: c$3.string.isRequired, borderWidth: c$3.number.isRequired, borderColor: c$3.string.isRequired };
var mn$3 = memo(bn$2), yn$3 = function(e3) {
  var r2 = e3.x, t2 = e3.y, n2 = e3.symbol, i2 = void 0 === n2 ? mn$3 : n2, o2 = e3.size, l2 = e3.datum, a2 = e3.color, d = e3.borderWidth, u2 = e3.borderColor, c2 = e3.label, f2 = e3.labelTextAnchor, p2 = void 0 === f2 ? "middle" : f2, h = e3.labelYOffset, g2 = void 0 === h ? -12 : h, b2 = zt$2(), m2 = Ur$2(), y2 = m2.animate, v2 = m2.config, _2 = useSpring({ transform: "translate(" + r2 + ", " + t2 + ")", config: v2, immediate: !y2 });
  return jsxs(animated.g, { transform: _2.transform, style: { pointerEvents: "none" }, children: [createElement(i2, { size: o2, color: a2, datum: l2, borderWidth: d, borderColor: u2 }), c2 && jsx("text", { textAnchor: p2, y: g2, style: Mt$2(b2.dots.text), children: c2 })] });
};
yn$3.propTypes = { x: c$3.number.isRequired, y: c$3.number.isRequired, datum: c$3.object.isRequired, size: c$3.number.isRequired, color: c$3.string.isRequired, borderWidth: c$3.number.isRequired, borderColor: c$3.string.isRequired, symbol: c$3.oneOfType([c$3.func, c$3.object]), label: c$3.oneOfType([c$3.string, c$3.number]), labelTextAnchor: c$3.oneOf(["start", "middle", "end"]), labelYOffset: c$3.number };
memo(yn$3);
var _n$2 = function(e3) {
  var r2 = e3.width, t2 = e3.height, n2 = e3.axis, i2 = e3.scale, o2 = e3.value, l2 = e3.lineStyle, a2 = e3.textStyle, d = e3.legend, s = e3.legendNode, u2 = e3.legendPosition, c2 = void 0 === u2 ? "top-right" : u2, f2 = e3.legendOffsetX, p2 = void 0 === f2 ? 14 : f2, h = e3.legendOffsetY, g2 = void 0 === h ? 14 : h, b2 = e3.legendOrientation, m2 = void 0 === b2 ? "horizontal" : b2, y2 = zt$2(), v2 = 0, _2 = 0, w2 = 0, k2 = 0;
  if ("y" === n2 ? (w2 = i2(o2), _2 = r2) : (v2 = i2(o2), k2 = t2), d && !s) {
    var R = function(e4) {
      var r3 = e4.axis, t3 = e4.width, n3 = e4.height, i3 = e4.position, o3 = e4.offsetX, l3 = e4.offsetY, a3 = e4.orientation, d2 = 0, s2 = 0, u3 = "vertical" === a3 ? -90 : 0, c3 = "start";
      if ("x" === r3) switch (i3) {
        case "top-left":
          d2 = -o3, s2 = l3, c3 = "end";
          break;
        case "top":
          s2 = -l3, c3 = "horizontal" === a3 ? "middle" : "start";
          break;
        case "top-right":
          d2 = o3, s2 = l3, c3 = "horizontal" === a3 ? "start" : "end";
          break;
        case "right":
          d2 = o3, s2 = n3 / 2, c3 = "horizontal" === a3 ? "start" : "middle";
          break;
        case "bottom-right":
          d2 = o3, s2 = n3 - l3, c3 = "start";
          break;
        case "bottom":
          s2 = n3 + l3, c3 = "horizontal" === a3 ? "middle" : "end";
          break;
        case "bottom-left":
          s2 = n3 - l3, d2 = -o3, c3 = "horizontal" === a3 ? "end" : "start";
          break;
        case "left":
          d2 = -o3, s2 = n3 / 2, c3 = "horizontal" === a3 ? "end" : "middle";
      }
      else switch (i3) {
        case "top-left":
          d2 = o3, s2 = -l3, c3 = "start";
          break;
        case "top":
          d2 = t3 / 2, s2 = -l3, c3 = "horizontal" === a3 ? "middle" : "start";
          break;
        case "top-right":
          d2 = t3 - o3, s2 = -l3, c3 = "horizontal" === a3 ? "end" : "start";
          break;
        case "right":
          d2 = t3 + o3, c3 = "horizontal" === a3 ? "start" : "middle";
          break;
        case "bottom-right":
          d2 = t3 - o3, s2 = l3, c3 = "end";
          break;
        case "bottom":
          d2 = t3 / 2, s2 = l3, c3 = "horizontal" === a3 ? "middle" : "end";
          break;
        case "bottom-left":
          d2 = o3, s2 = l3, c3 = "horizontal" === a3 ? "start" : "end";
          break;
        case "left":
          d2 = -o3, c3 = "horizontal" === a3 ? "end" : "middle";
      }
      return { x: d2, y: s2, rotation: u3, textAnchor: c3 };
    }({ axis: n2, width: r2, height: t2, position: c2, offsetX: p2, offsetY: g2, orientation: m2 });
    s = jsx("text", { transform: "translate(" + R.x + ", " + R.y + ") rotate(" + R.rotation + ")", textAnchor: R.textAnchor, dominantBaseline: "central", style: a2, children: d });
  }
  return jsxs("g", { transform: "translate(" + v2 + ", " + w2 + ")", children: [jsx("line", { x1: 0, x2: _2, y1: 0, y2: k2, stroke: y2.markers.lineColor, strokeWidth: y2.markers.lineStrokeWidth, style: l2 }), s] });
};
_n$2.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, axis: c$3.oneOf(["x", "y"]).isRequired, scale: c$3.func.isRequired, value: c$3.oneOfType([c$3.number, c$3.string, c$3.instanceOf(Date)]).isRequired, lineStyle: c$3.object, textStyle: c$3.object, legend: c$3.string, legendPosition: c$3.oneOf(["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]), legendOffsetX: c$3.number.isRequired, legendOffsetY: c$3.number.isRequired, legendOrientation: c$3.oneOf(["horizontal", "vertical"]).isRequired };
var wn$2 = memo(_n$2), kn$3 = function(e3) {
  var r2 = e3.markers, t2 = e3.width, n2 = e3.height, i2 = e3.xScale, o2 = e3.yScale;
  return r2 && 0 !== r2.length ? r2.map(function(e4, r3) {
    return jsx(wn$2, jr$2({}, e4, { width: t2, height: n2, scale: "y" === e4.axis ? o2 : i2 }), r3);
  }) : null;
};
kn$3.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, xScale: c$3.func.isRequired, yScale: c$3.func.isRequired, markers: c$3.arrayOf(c$3.shape({ axis: c$3.oneOf(["x", "y"]).isRequired, value: c$3.oneOfType([c$3.number, c$3.string, c$3.instanceOf(Date)]).isRequired, lineStyle: c$3.object, textStyle: c$3.object })) };
memo(kn$3);
var Cn$1 = function(e3) {
  return Qe(e3) ? e3 : function(r2) {
    return y$2(r2, e3);
  };
}, Wn$1 = function(e3) {
  return useMemo(function() {
    return Cn$1(e3);
  }, [e3]);
}, Bn$1 = Object.keys(Et$2), Gn$1 = Object.keys(un$3), Ln$1 = function(e3, r2, t2) {
  if ("*" === e3) return true;
  if (Qe(e3)) return e3(r2);
  if (je(e3)) {
    var n2 = t2 ? y$2(r2, t2) : r2;
    return Mr(Tr(n2, Object.keys(e3)), e3);
  }
  return false;
}, In$1 = function(e3, r2, t2, n2) {
  var i2 = {}, o2 = i2.dataKey, l2 = i2.colorKey, a2 = void 0 === l2 ? "color" : l2, d = i2.targetKey, s = void 0 === d ? "fill" : d, u2 = [], c2 = {};
  return e3.length && r2.length && (u2 = [].concat(e3), r2.forEach(function(r3) {
    for (var n3 = function() {
      var n4 = t2[i3], l3 = n4.id, d2 = n4.match;
      if (Ln$1(d2, r3, o2)) {
        var f2 = e3.find(function(e4) {
          return e4.id === l3;
        });
        if (f2) {
          if (Gn$1.includes(f2.type)) if ("inherit" === f2.background || "inherit" === f2.color) {
            var p2 = y$2(r3, a2), h = f2.background, g2 = f2.color, b2 = l3;
            "inherit" === f2.background && (b2 = b2 + ".bg." + p2, h = p2), "inherit" === f2.color && (b2 = b2 + ".fg." + p2, g2 = p2), v$8(r3, s, "url(#" + b2 + ")"), c2[b2] || (u2.push(jr$2({}, f2, { id: b2, background: h, color: g2 })), c2[b2] = 1);
          } else v$8(r3, s, "url(#" + l3 + ")");
          else if (Bn$1.includes(f2.type)) {
            if (f2.colors.map(function(e4) {
              return e4.color;
            }).includes("inherit")) {
              var m2 = y$2(r3, a2), _2 = l3, w2 = jr$2({}, f2, { colors: f2.colors.map(function(e4, r4) {
                return "inherit" !== e4.color ? e4 : (_2 = _2 + "." + r4 + "." + m2, jr$2({}, e4, { color: "inherit" === e4.color ? m2 : e4.color }));
              }) });
              w2.id = _2, v$8(r3, s, "url(#" + _2 + ")"), c2[_2] || (u2.push(w2), c2[_2] = 1);
            } else v$8(r3, s, "url(#" + l3 + ")");
          }
        }
        return "break";
      }
    }, i3 = 0; i3 < t2.length; i3++) {
      if ("break" === n3()) break;
    }
  })), u2;
};
function v$5() {
  return v$5 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var o2 = arguments[i2];
      for (var n2 in o2) Object.prototype.hasOwnProperty.call(o2, n2) && (t2[n2] = o2[n2]);
    }
    return t2;
  }, v$5.apply(this, arguments);
}
var x$5 = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 }, m$5 = function(t2, i2) {
  return "translate(" + t2 + "px, " + i2 + "px)";
}, b$7 = memo(function(t2) {
  var o2, n2 = t2.position, r2 = t2.anchor, e3 = t2.children, l2 = zt$1(), d = Ur$1(), y2 = d.animate, f2 = d.config, b2 = kt$1(), g2 = b2[0], w2 = b2[1], T2 = useRef(false), C2 = void 0, E2 = false, P2 = w2.width > 0 && w2.height > 0, j2 = Math.round(n2[0]), N2 = Math.round(n2[1]);
  P2 && ("top" === r2 ? (j2 -= w2.width / 2, N2 -= w2.height + 14) : "right" === r2 ? (j2 += 14, N2 -= w2.height / 2) : "bottom" === r2 ? (j2 -= w2.width / 2, N2 += 14) : "left" === r2 ? (j2 -= w2.width + 14, N2 -= w2.height / 2) : "center" === r2 && (j2 -= w2.width / 2, N2 -= w2.height / 2), C2 = { transform: m$5(j2, N2) }, T2.current || (E2 = true), T2.current = [j2, N2]);
  var O2 = useSpring({ to: C2, config: f2, immediate: !y2 || E2 }), V2 = v$5({}, x$5, l2.tooltip.wrapper, { transform: null != (o2 = O2.transform) ? o2 : m$5(j2, N2), opacity: O2.transform ? 1 : 0 });
  return jsx(animated.div, { ref: g2, style: V2, children: e3 });
});
b$7.displayName = "TooltipWrapper";
var g$3 = memo(function(t2) {
  var i2 = t2.size, o2 = void 0 === i2 ? 12 : i2, n2 = t2.color, r2 = t2.style;
  return jsx("span", { style: v$5({ display: "block", width: o2, height: o2, background: n2 }, void 0 === r2 ? {} : r2) });
});
memo(function(t2) {
  var i2, o2 = t2.id, n2 = t2.value, r2 = t2.format, e3 = t2.enableChip, l2 = void 0 !== e3 && e3, a2 = t2.color, c2 = t2.renderContent, h = zt$1(), u2 = Ot$1(r2);
  if ("function" == typeof c2) i2 = c2();
  else {
    var f2 = n2;
    void 0 !== u2 && void 0 !== f2 && (f2 = u2(f2)), i2 = jsxs("div", { style: h.tooltip.basic, children: [l2 && jsx(g$3, { color: a2, style: h.tooltip.chip }), void 0 !== f2 ? jsxs("span", { children: [o2, ": ", jsx("strong", { children: "" + f2 })] }) : o2] });
  }
  return jsx("div", { style: h.tooltip.container, children: i2 });
});
var T$6 = { width: "100%", borderCollapse: "collapse" }, C$6 = memo(function(t2) {
  var i2, o2 = t2.title, n2 = t2.rows, r2 = void 0 === n2 ? [] : n2, e3 = t2.renderContent, l2 = zt$1();
  return r2.length ? (i2 = "function" == typeof e3 ? e3() : jsxs("div", { children: [o2 && o2, jsx("table", { style: v$5({}, T$6, l2.tooltip.table), children: jsx("tbody", { children: r2.map(function(t3, i3) {
    return jsx("tr", { children: t3.map(function(t4, i4) {
      return jsx("td", { style: l2.tooltip.tableCell, children: t4 }, i4);
    }) }, i3);
  }) }) })] }), jsx("div", { style: l2.tooltip.container, children: i2 })) : null;
});
C$6.displayName = "TableTooltip";
var E$6 = memo(function(t2) {
  var i2 = t2.x0, n2 = t2.x1, r2 = t2.y0, e3 = t2.y1, l2 = zt$1(), u2 = Ur$1(), d = u2.animate, y2 = u2.config, f2 = useMemo(function() {
    return v$5({}, l2.crosshair.line, { pointerEvents: "none" });
  }, [l2.crosshair.line]), x2 = useSpring({ x1: i2, x2: n2, y1: r2, y2: e3, config: y2, immediate: !d });
  return jsx(animated.line, v$5({}, x2, { fill: "none", style: f2 }));
});
E$6.displayName = "CrosshairLine";
var P$6 = memo(function(t2) {
  var i2, o2, n2 = t2.width, r2 = t2.height, e3 = t2.type, l2 = t2.x, a2 = t2.y;
  return "cross" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: r2 }, o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }) : "top-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "top" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: a2 } : "top-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "right" === e3 ? o2 = { x0: l2, x1: n2, y0: a2, y1: a2 } : "bottom-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "bottom" === e3 ? i2 = { x0: l2, x1: l2, y0: a2, y1: r2 } : "bottom-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "left" === e3 ? o2 = { x0: 0, x1: l2, y0: a2, y1: a2 } : "x" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: r2 } : "y" === e3 && (o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }), jsxs(Fragment, { children: [i2 && jsx(E$6, { x0: i2.x0, x1: i2.x1, y0: i2.y0, y1: i2.y1 }), o2 && jsx(E$6, { x0: o2.x0, x1: o2.x1, y0: o2.y0, y1: o2.y1 })] });
});
P$6.displayName = "Crosshair";
createContext({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} });
var N$5 = { isVisible: false, position: [null, null], content: null, anchor: null };
createContext(N$5);
function jr$1() {
  return jr$1 = Object.assign ? Object.assign.bind() : function(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = arguments[r2];
      for (var n2 in t2) Object.prototype.hasOwnProperty.call(t2, n2) && (e3[n2] = t2[n2]);
    }
    return e3;
  }, jr$1.apply(this, arguments);
}
function Br$1(e3, r2) {
  if (null == e3) return {};
  var t2, n2, i2 = {}, o2 = Object.keys(e3);
  for (n2 = 0; n2 < o2.length; n2++) t2 = o2[n2], r2.indexOf(t2) >= 0 || (i2[t2] = e3[t2]);
  return i2;
}
var Yr$1 = createContext(), Er$1 = { animate: c$3.bool, motionConfig: c$3.oneOfType([c$3.oneOf(Object.keys(config)), c$3.shape({ mass: c$3.number, tension: c$3.number, friction: c$3.number, clamp: c$3.bool, precision: c$3.number, velocity: c$3.number, duration: c$3.number, easing: c$3.func })]) };
({ children: c$3.node.isRequired, animate: Er$1.animate, config: Er$1.motionConfig });
var Ur$1 = function() {
  return useContext(Yr$1);
}, Xr$1 = { nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"], BrBG: W$5(scheme$q), PRGn: W$5(scheme$p), PiYG: W$5(scheme$o), PuOr: W$5(scheme$n), RdBu: W$5(scheme$m), RdGy: W$5(scheme$l), RdYlBu: W$5(scheme$k), RdYlGn: W$5(scheme$j), spectral: W$5(scheme$i), blues: W$5(scheme$5), greens: W$5(scheme$4), greys: W$5(scheme$3), oranges: W$5(scheme), purples: W$5(scheme$2), reds: W$5(scheme$1), BuGn: W$5(scheme$h), BuPu: W$5(scheme$g), GnBu: W$5(scheme$f), OrRd: W$5(scheme$e), PuBuGn: W$5(scheme$d), PuBu: W$5(scheme$c), PuRd: W$5(scheme$b), RdPu: W$5(scheme$a), YlGnBu: W$5(scheme$9), YlGn: W$5(scheme$8), YlOrBr: W$5(scheme$7), YlOrRd: W$5(scheme$6) }, Nr$1 = Object.keys(Xr$1);
({ nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: e, accent: r, dark2: n, paired: t, pastel1: o, pastel2: i, set1: u$2, set2: a, set3: l, brown_blueGreen: W$5(scheme$q), purpleRed_green: W$5(scheme$p), pink_yellowGreen: W$5(scheme$o), purple_orange: W$5(scheme$n), red_blue: W$5(scheme$m), red_grey: W$5(scheme$l), red_yellow_blue: W$5(scheme$k), red_yellow_green: W$5(scheme$j), spectral: W$5(scheme$i), blues: W$5(scheme$5), greens: W$5(scheme$4), greys: W$5(scheme$3), oranges: W$5(scheme), purples: W$5(scheme$2), reds: W$5(scheme$1), blue_green: W$5(scheme$h), blue_purple: W$5(scheme$g), green_blue: W$5(scheme$f), orange_red: W$5(scheme$e), purple_blue_green: W$5(scheme$d), purple_blue: W$5(scheme$c), purple_red: W$5(scheme$b), red_purple: W$5(scheme$a), yellow_green_blue: W$5(scheme$9), yellow_green: W$5(scheme$8), yellow_orange_brown: W$5(scheme$7), yellow_orange_red: W$5(scheme$6) });
c$3.oneOfType([c$3.oneOf(Nr$1), c$3.func, c$3.arrayOf(c$3.string)]);
var rt$2 = { basis: $e$3, basisClosed: er, basisOpen: rr, bundle: tr, cardinal: nr, cardinalClosed: ir, cardinalOpen: or, catmullRom: lr, catmullRomClosed: ar, catmullRomOpen: dr, linear: sr, linearClosed: ur, monotoneX, monotoneY, natural: pr$2, step: hr, stepAfter, stepBefore }, tt$2 = Object.keys(rt$2);
tt$2.filter(function(e3) {
  return e3.endsWith("Closed");
});
Ze(tt$2, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
Ze(tt$2, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
c$3.shape({ top: c$3.number, right: c$3.number, bottom: c$3.number, left: c$3.number }).isRequired;
var ht$1 = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
c$3.oneOf(ht$1);
ordinal(l);
var kt$1 = function() {
  var e3 = useRef(null), r2 = useState({ left: 0, top: 0, width: 0, height: 0 }), t2 = r2[0], l2 = r2[1], a2 = useState(function() {
    return "undefined" == typeof ResizeObserver ? null : new ResizeObserver(function(e4) {
      var r3 = e4[0];
      return l2(r3.contentRect);
    });
  })[0];
  return useEffect(function() {
    return e3.current && null !== a2 && a2.observe(e3.current), function() {
      null !== a2 && a2.disconnect();
    };
  }, []), [e3, t2];
}, xt$1 = function(e3) {
  return "function" == typeof e3 ? e3 : "string" == typeof e3 ? 0 === e3.indexOf("time:") ? timeFormat(e3.slice("5")) : format(e3) : function(e4) {
    return "" + e4;
  };
}, Ot$1 = function(e3) {
  return useMemo(function() {
    return xt$1(e3);
  }, [e3]);
}, qt$1 = createContext();
({ children: c$3.node.isRequired, theme: c$3.object });
var zt$1 = function() {
  return useContext(qt$1);
}, Tt$1 = ["outlineWidth", "outlineColor", "outlineOpacity"], Mt$1 = function(e3) {
  return e3.outlineWidth, e3.outlineColor, e3.outlineOpacity, Br$1(e3, Tt$1);
};
({ children: c$3.node.isRequired, condition: c$3.bool.isRequired, wrapper: c$3.element.isRequired });
({ children: c$3.element.isRequired, isInteractive: c$3.bool, renderWrapper: c$3.bool, theme: c$3.object, animate: c$3.bool, motionConfig: c$3.oneOfType([c$3.string, Er$1.motionConfig]) });
({ children: c$3.func.isRequired, isInteractive: c$3.bool, renderWrapper: c$3.bool, theme: c$3.object.isRequired, animate: c$3.bool.isRequired, motionConfig: c$3.oneOfType([c$3.string, Er$1.motionConfig]) });
({ children: c$3.func.isRequired });
var Yt$1 = ["id", "colors"], Dt$1 = function(e3) {
  var r2 = e3.id, t2 = e3.colors, n2 = Br$1(e3, Yt$1);
  return jsx("linearGradient", jr$1({ id: r2, x1: 0, x2: 0, y1: 0, y2: 1 }, n2, { children: t2.map(function(e4) {
    var r3 = e4.offset, t3 = e4.color, n3 = e4.opacity;
    return jsx("stop", { offset: r3 + "%", stopColor: t3, stopOpacity: void 0 !== n3 ? n3 : 1 }, r3);
  }) }));
};
Dt$1.propTypes = { id: c$3.string.isRequired, colors: c$3.arrayOf(c$3.shape({ offset: c$3.number.isRequired, color: c$3.string.isRequired, opacity: c$3.number })).isRequired, gradientTransform: c$3.string };
var Et$1 = { linearGradient: Dt$1 }, Ut$1 = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false }, Ft$1 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.background, n2 = void 0 === t2 ? Ut$1.background : t2, i2 = e3.color, o2 = void 0 === i2 ? Ut$1.color : i2, l2 = e3.size, a2 = void 0 === l2 ? Ut$1.size : l2, d = e3.padding, s = void 0 === d ? Ut$1.padding : d, u2 = e3.stagger, c2 = void 0 === u2 ? Ut$1.stagger : u2, f2 = a2 + s, p2 = a2 / 2, h = s / 2;
  return true === c2 && (f2 = 2 * a2 + 2 * s), jsxs("pattern", { id: r2, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: f2, height: f2, fill: n2 }), jsx("circle", { cx: h + p2, cy: h + p2, r: p2, fill: o2 }), c2 && jsx("circle", { cx: 1.5 * s + a2 + p2, cy: 1.5 * s + a2 + p2, r: p2, fill: o2 })] });
});
Ft$1.displayName = "PatternDots", Ft$1.propTypes = { id: c$3.string.isRequired, color: c$3.string.isRequired, background: c$3.string.isRequired, size: c$3.number.isRequired, padding: c$3.number.isRequired, stagger: c$3.bool.isRequired };
var Ht$1 = function(e3) {
  return e3 * Math.PI / 180;
}, Kt = function(e3) {
  return 180 * e3 / Math.PI;
}, Vt = function(e3) {
  return e3.startAngle + (e3.endAngle - e3.startAngle) / 2;
}, Jt = function(e3, r2) {
  return { x: Math.cos(e3) * r2, y: Math.sin(e3) * r2 };
}, nn$2 = { spacing: 5, rotation: 0, background: "#000000", color: "#ffffff", lineWidth: 2 }, on$2 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.spacing, n2 = void 0 === t2 ? nn$2.spacing : t2, i2 = e3.rotation, o2 = void 0 === i2 ? nn$2.rotation : i2, l2 = e3.background, a2 = void 0 === l2 ? nn$2.background : l2, d = e3.color, s = void 0 === d ? nn$2.color : d, u2 = e3.lineWidth, c2 = void 0 === u2 ? nn$2.lineWidth : u2, f2 = Math.round(o2) % 360, p2 = Math.abs(n2);
  f2 > 180 ? f2 -= 360 : f2 > 90 ? f2 -= 180 : f2 < -180 ? f2 += 360 : f2 < -90 && (f2 += 180);
  var h, g2 = p2, b2 = p2;
  return 0 === f2 ? h = "\n                M 0 0 L " + g2 + " 0\n                M 0 " + b2 + " L " + g2 + " " + b2 + "\n            " : 90 === f2 ? h = "\n                M 0 0 L 0 " + b2 + "\n                M " + g2 + " 0 L " + g2 + " " + b2 + "\n            " : (g2 = Math.abs(p2 / Math.sin(Ht$1(f2))), b2 = p2 / Math.sin(Ht$1(90 - f2)), h = f2 > 0 ? "\n                    M 0 " + -b2 + " L " + 2 * g2 + " " + b2 + "\n                    M " + -g2 + " " + -b2 + " L " + g2 + " " + b2 + "\n                    M " + -g2 + " 0 L " + g2 + " " + 2 * b2 + "\n                " : "\n                    M " + -g2 + " " + b2 + " L " + g2 + " " + -b2 + "\n                    M " + -g2 + " " + 2 * b2 + " L " + 2 * g2 + " " + -b2 + "\n                    M 0 " + 2 * b2 + " L " + 2 * g2 + " 0\n                "), jsxs("pattern", { id: r2, width: g2, height: b2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: g2, height: b2, fill: a2, stroke: "rgba(255, 0, 0, 0.1)", strokeWidth: 0 }), jsx("path", { d: h, strokeWidth: c2, stroke: s, strokeLinecap: "square" })] });
});
on$2.displayName = "PatternLines", on$2.propTypes = { id: c$3.string.isRequired, spacing: c$3.number.isRequired, rotation: c$3.number.isRequired, background: c$3.string.isRequired, color: c$3.string.isRequired, lineWidth: c$3.number.isRequired };
var an$2 = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false }, dn$2 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.color, n2 = void 0 === t2 ? an$2.color : t2, i2 = e3.background, o2 = void 0 === i2 ? an$2.background : i2, l2 = e3.size, a2 = void 0 === l2 ? an$2.size : l2, d = e3.padding, s = void 0 === d ? an$2.padding : d, u2 = e3.stagger, c2 = void 0 === u2 ? an$2.stagger : u2, f2 = a2 + s, p2 = s / 2;
  return true === c2 && (f2 = 2 * a2 + 2 * s), jsxs("pattern", { id: r2, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: f2, height: f2, fill: o2 }), jsx("rect", { x: p2, y: p2, width: a2, height: a2, fill: n2 }), c2 && jsx("rect", { x: 1.5 * s + a2, y: 1.5 * s + a2, width: a2, height: a2, fill: n2 })] });
});
dn$2.displayName = "PatternSquares", dn$2.propTypes = { id: c$3.string.isRequired, color: c$3.string.isRequired, background: c$3.string.isRequired, size: c$3.number.isRequired, padding: c$3.number.isRequired, stagger: c$3.bool.isRequired };
var un$2 = { patternDots: Ft$1, patternLines: on$2, patternSquares: dn$2 }, cn$2 = ["type"], fn$2 = jr$1({}, Et$1, un$2), pn$2 = function(e3) {
  var r2 = e3.defs;
  return !r2 || r2.length < 1 ? null : jsx("defs", { "aria-hidden": true, children: r2.map(function(e4) {
    var r3 = e4.type, t2 = Br$1(e4, cn$2);
    return fn$2[r3] ? createElement(fn$2[r3], jr$1({ key: t2.id }, t2)) : null;
  }) });
};
pn$2.propTypes = { defs: c$3.arrayOf(c$3.shape({ type: c$3.oneOf(Object.keys(fn$2)).isRequired, id: c$3.string.isRequired })) };
memo(pn$2);
({ width: c$3.number.isRequired, height: c$3.number.isRequired, margin: c$3.shape({ top: c$3.number.isRequired, left: c$3.number.isRequired }).isRequired, defs: c$3.array, children: c$3.oneOfType([c$3.arrayOf(c$3.node), c$3.node]).isRequired, role: c$3.string, isFocusable: c$3.bool, ariaLabel: c$3.string, ariaLabelledBy: c$3.string, ariaDescribedBy: c$3.string });
var bn$1 = function(e3) {
  var r2 = e3.size, t2 = e3.color, n2 = e3.borderWidth, i2 = e3.borderColor;
  return jsx("circle", { r: r2 / 2, fill: t2, stroke: i2, strokeWidth: n2, style: { pointerEvents: "none" } });
};
bn$1.propTypes = { size: c$3.number.isRequired, color: c$3.string.isRequired, borderWidth: c$3.number.isRequired, borderColor: c$3.string.isRequired };
var mn$2 = memo(bn$1), yn$2 = function(e3) {
  var r2 = e3.x, t2 = e3.y, n2 = e3.symbol, i2 = void 0 === n2 ? mn$2 : n2, o2 = e3.size, l2 = e3.datum, a2 = e3.color, d = e3.borderWidth, u2 = e3.borderColor, c2 = e3.label, f2 = e3.labelTextAnchor, p2 = void 0 === f2 ? "middle" : f2, h = e3.labelYOffset, g2 = void 0 === h ? -12 : h, b2 = zt$1(), m2 = Ur$1(), y2 = m2.animate, v2 = m2.config, _2 = useSpring({ transform: "translate(" + r2 + ", " + t2 + ")", config: v2, immediate: !y2 });
  return jsxs(animated.g, { transform: _2.transform, style: { pointerEvents: "none" }, children: [createElement(i2, { size: o2, color: a2, datum: l2, borderWidth: d, borderColor: u2 }), c2 && jsx("text", { textAnchor: p2, y: g2, style: Mt$1(b2.dots.text), children: c2 })] });
};
yn$2.propTypes = { x: c$3.number.isRequired, y: c$3.number.isRequired, datum: c$3.object.isRequired, size: c$3.number.isRequired, color: c$3.string.isRequired, borderWidth: c$3.number.isRequired, borderColor: c$3.string.isRequired, symbol: c$3.oneOfType([c$3.func, c$3.object]), label: c$3.oneOfType([c$3.string, c$3.number]), labelTextAnchor: c$3.oneOf(["start", "middle", "end"]), labelYOffset: c$3.number };
memo(yn$2);
var _n$1 = function(e3) {
  var r2 = e3.width, t2 = e3.height, n2 = e3.axis, i2 = e3.scale, o2 = e3.value, l2 = e3.lineStyle, a2 = e3.textStyle, d = e3.legend, s = e3.legendNode, u2 = e3.legendPosition, c2 = void 0 === u2 ? "top-right" : u2, f2 = e3.legendOffsetX, p2 = void 0 === f2 ? 14 : f2, h = e3.legendOffsetY, g2 = void 0 === h ? 14 : h, b2 = e3.legendOrientation, m2 = void 0 === b2 ? "horizontal" : b2, y2 = zt$1(), v2 = 0, _2 = 0, w2 = 0, k2 = 0;
  if ("y" === n2 ? (w2 = i2(o2), _2 = r2) : (v2 = i2(o2), k2 = t2), d && !s) {
    var R = function(e4) {
      var r3 = e4.axis, t3 = e4.width, n3 = e4.height, i3 = e4.position, o3 = e4.offsetX, l3 = e4.offsetY, a3 = e4.orientation, d2 = 0, s2 = 0, u3 = "vertical" === a3 ? -90 : 0, c3 = "start";
      if ("x" === r3) switch (i3) {
        case "top-left":
          d2 = -o3, s2 = l3, c3 = "end";
          break;
        case "top":
          s2 = -l3, c3 = "horizontal" === a3 ? "middle" : "start";
          break;
        case "top-right":
          d2 = o3, s2 = l3, c3 = "horizontal" === a3 ? "start" : "end";
          break;
        case "right":
          d2 = o3, s2 = n3 / 2, c3 = "horizontal" === a3 ? "start" : "middle";
          break;
        case "bottom-right":
          d2 = o3, s2 = n3 - l3, c3 = "start";
          break;
        case "bottom":
          s2 = n3 + l3, c3 = "horizontal" === a3 ? "middle" : "end";
          break;
        case "bottom-left":
          s2 = n3 - l3, d2 = -o3, c3 = "horizontal" === a3 ? "end" : "start";
          break;
        case "left":
          d2 = -o3, s2 = n3 / 2, c3 = "horizontal" === a3 ? "end" : "middle";
      }
      else switch (i3) {
        case "top-left":
          d2 = o3, s2 = -l3, c3 = "start";
          break;
        case "top":
          d2 = t3 / 2, s2 = -l3, c3 = "horizontal" === a3 ? "middle" : "start";
          break;
        case "top-right":
          d2 = t3 - o3, s2 = -l3, c3 = "horizontal" === a3 ? "end" : "start";
          break;
        case "right":
          d2 = t3 + o3, c3 = "horizontal" === a3 ? "start" : "middle";
          break;
        case "bottom-right":
          d2 = t3 - o3, s2 = l3, c3 = "end";
          break;
        case "bottom":
          d2 = t3 / 2, s2 = l3, c3 = "horizontal" === a3 ? "middle" : "end";
          break;
        case "bottom-left":
          d2 = o3, s2 = l3, c3 = "horizontal" === a3 ? "start" : "end";
          break;
        case "left":
          d2 = -o3, c3 = "horizontal" === a3 ? "end" : "middle";
      }
      return { x: d2, y: s2, rotation: u3, textAnchor: c3 };
    }({ axis: n2, width: r2, height: t2, position: c2, offsetX: p2, offsetY: g2, orientation: m2 });
    s = jsx("text", { transform: "translate(" + R.x + ", " + R.y + ") rotate(" + R.rotation + ")", textAnchor: R.textAnchor, dominantBaseline: "central", style: a2, children: d });
  }
  return jsxs("g", { transform: "translate(" + v2 + ", " + w2 + ")", children: [jsx("line", { x1: 0, x2: _2, y1: 0, y2: k2, stroke: y2.markers.lineColor, strokeWidth: y2.markers.lineStrokeWidth, style: l2 }), s] });
};
_n$1.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, axis: c$3.oneOf(["x", "y"]).isRequired, scale: c$3.func.isRequired, value: c$3.oneOfType([c$3.number, c$3.string, c$3.instanceOf(Date)]).isRequired, lineStyle: c$3.object, textStyle: c$3.object, legend: c$3.string, legendPosition: c$3.oneOf(["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]), legendOffsetX: c$3.number.isRequired, legendOffsetY: c$3.number.isRequired, legendOrientation: c$3.oneOf(["horizontal", "vertical"]).isRequired };
var wn$1 = memo(_n$1), kn$2 = function(e3) {
  var r2 = e3.markers, t2 = e3.width, n2 = e3.height, i2 = e3.xScale, o2 = e3.yScale;
  return r2 && 0 !== r2.length ? r2.map(function(e4, r3) {
    return jsx(wn$1, jr$1({}, e4, { width: t2, height: n2, scale: "y" === e4.axis ? o2 : i2 }), r3);
  }) : null;
};
kn$2.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, xScale: c$3.func.isRequired, yScale: c$3.func.isRequired, markers: c$3.arrayOf(c$3.shape({ axis: c$3.oneOf(["x", "y"]).isRequired, value: c$3.oneOfType([c$3.number, c$3.string, c$3.instanceOf(Date)]).isRequired, lineStyle: c$3.object, textStyle: c$3.object })) };
memo(kn$2);
var Cn = function(e3) {
  return Qe(e3) ? e3 : function(r2) {
    return y$2(r2, e3);
  };
}, Wn = function(e3) {
  return useMemo(function() {
    return Cn(e3);
  }, [e3]);
};
function qe$2() {
  return qe$2 = Object.assign ? Object.assign.bind() : function(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var n2 = arguments[r2];
      for (var t2 in n2) Object.prototype.hasOwnProperty.call(n2, t2) && (e3[t2] = n2[t2]);
    }
    return e3;
  }, qe$2.apply(this, arguments);
}
function Ce$1(e3, r2) {
  (null == r2 || r2 > e3.length) && (r2 = e3.length);
  for (var n2 = 0, t2 = new Array(r2); n2 < r2; n2++) t2[n2] = e3[n2];
  return t2;
}
function Ge$1(e3, r2) {
  var n2 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
  if (n2) return (n2 = n2.call(e3)).next.bind(n2);
  if (Array.isArray(e3) || (n2 = function(e4, r3) {
    if (e4) {
      if ("string" == typeof e4) return Ce$1(e4, r3);
      var n3 = Object.prototype.toString.call(e4).slice(8, -1);
      return "Object" === n3 && e4.constructor && (n3 = e4.constructor.name), "Map" === n3 || "Set" === n3 ? Array.from(e4) : "Arguments" === n3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3) ? Ce$1(e4, r3) : void 0;
    }
  }(e3)) || r2) {
    n2 && (e3 = n2);
    var t2 = 0;
    return function() {
      return t2 >= e3.length ? { done: true } : { done: false, value: e3[t2++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var Re$2 = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: e, accent: r, dark2: n, paired: t, pastel1: o, pastel2: i, set1: u$2, set2: a, set3: l, tableau10: c$2 }, Pe$2 = { brown_blueGreen: scheme$q, purpleRed_green: scheme$p, pink_yellowGreen: scheme$o, purple_orange: scheme$n, red_blue: scheme$m, red_grey: scheme$l, red_yellow_blue: scheme$k, red_yellow_green: scheme$j, spectral: scheme$i }, Ue$2 = { brown_blueGreen: v$6, purpleRed_green: _$3, pink_yellowGreen: w$5, purple_orange: k$5, red_blue: j$6, red_grey: A$2, red_yellow_blue: O$4, red_yellow_green: z$4, spectral: E$7 }, De$2 = { blues: scheme$5, greens: scheme$4, greys: scheme$3, oranges: scheme, purples: scheme$2, reds: scheme$1, blue_green: scheme$h, blue_purple: scheme$g, green_blue: scheme$f, orange_red: scheme$e, purple_blue_green: scheme$d, purple_blue: scheme$c, purple_red: scheme$b, red_purple: scheme$a, yellow_green_blue: scheme$9, yellow_green: scheme$8, yellow_orange_brown: scheme$7, yellow_orange_red: scheme$6 }, $e$2 = { blues: K$3, greens: L$3, greys: N$6, oranges: Q$4, purples: W$4, reds: X$5, turbo: Y$6, viridis: Z$2, inferno, magma, plasma, cividis: te$1, warm, cool, cubehelixDefault: ue$1, blue_green: ae$1, blue_purple: le$1, green_blue: ce$1, orange_red: se$1, purple_blue_green: fe$1, purple_blue: pe$1, purple_red: de$1, red_purple: me$1, yellow_green_blue: he$1, yellow_green: ge$1, yellow_orange_brown: ye, yellow_orange_red: be };
qe$2({}, Re$2, Pe$2, De$2);
var Le$2 = { rainbow: ve$1, sinebow: _e };
qe$2({}, Ue$2, $e$2, Le$2);
var We$1 = function(e3, r2) {
  if ("function" == typeof e3) return e3;
  if (je(e3)) {
    if (function(e4) {
      return void 0 !== e4.theme;
    }(e3)) {
      if (void 0 === r2) throw new Error("Unable to use color from theme as no theme was provided");
      var n2 = y$2(r2, e3.theme);
      if (void 0 === n2) throw new Error("Color from theme is undefined at path: '" + e3.theme + "'");
      return function() {
        return n2;
      };
    }
    if (function(e4) {
      return void 0 !== e4.from;
    }(e3)) {
      var t2 = function(r3) {
        return y$2(r3, e3.from);
      };
      if (Array.isArray(e3.modifiers)) {
        for (var o2, i2 = [], u2 = function() {
          var e4 = o2.value, r3 = e4[0], n3 = e4[1];
          if ("brighter" === r3) i2.push(function(e6) {
            return e6.brighter(n3);
          });
          else if ("darker" === r3) i2.push(function(e6) {
            return e6.darker(n3);
          });
          else {
            if ("opacity" !== r3) throw new Error("Invalid color modifier: '" + r3 + "', must be one of: 'brighter', 'darker', 'opacity'");
            i2.push(function(e6) {
              return e6.opacity = n3, e6;
            });
          }
        }, a2 = Ge$1(e3.modifiers); !(o2 = a2()).done; ) u2();
        return 0 === i2.length ? t2 : function(e4) {
          return i2.reduce(function(e6, r3) {
            return r3(e6);
          }, rgb$1(t2(e4))).toString();
        };
      }
      return t2;
    }
    throw new Error("Invalid color spec, you should either specify 'theme' or 'from' when using a config object");
  }
  return function() {
    return e3;
  };
}, Xe$1 = function(e3, r2) {
  return useMemo(function() {
    return We$1(e3, r2);
  }, [e3, r2]);
};
c$3.oneOfType([c$3.string, c$3.func, c$3.shape({ theme: c$3.string.isRequired }), c$3.shape({ from: c$3.string.isRequired, modifiers: c$3.arrayOf(c$3.array) })]);
function M$1() {
  return M$1 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var n2 = 1; n2 < arguments.length; n2++) {
      var e3 = arguments[n2];
      for (var r2 in e3) Object.prototype.hasOwnProperty.call(e3, r2) && (t2[r2] = e3[r2]);
    }
    return t2;
  }, M$1.apply(this, arguments);
}
var k$4 = { pointerEvents: "none" }, b$6 = function(n2) {
  var e3 = n2.label, r2 = n2.style, a2 = zt$1();
  return jsx(animated.g, { transform: r2.transform, opacity: r2.progress, style: k$4, children: jsx(animated.text, { textAnchor: "middle", dominantBaseline: "central", style: M$1({}, a2.labels.text, { fill: r2.textColor }), children: e3 }) });
}, C$5 = function(t2) {
  var n2 = t2 % (2 * Math.PI);
  return n2 < 0 && (n2 += 2 * Math.PI), n2;
}, L$2 = function(t2, n2) {
  return t2.filter(function(t3) {
    return Math.abs(Kt(t3.arc.endAngle - t3.arc.startAngle)) >= n2;
  });
}, E$5 = { startAngle: { enter: function(t2) {
  return M$1({}, t2, { endAngle: t2.startAngle });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  return M$1({}, t2, { startAngle: t2.endAngle });
} }, middleAngle: { enter: function(t2) {
  var n2 = t2.startAngle + (t2.endAngle - t2.startAngle) / 2;
  return M$1({}, t2, { startAngle: n2, endAngle: n2 });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  var n2 = t2.startAngle + (t2.endAngle - t2.startAngle) / 2;
  return M$1({}, t2, { startAngle: n2, endAngle: n2 });
} }, endAngle: { enter: function(t2) {
  return M$1({}, t2, { startAngle: t2.endAngle });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  return M$1({}, t2, { endAngle: t2.startAngle });
} }, innerRadius: { enter: function(t2) {
  return M$1({}, t2, { outerRadius: t2.innerRadius });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  return M$1({}, t2, { innerRadius: t2.outerRadius });
} }, centerRadius: { enter: function(t2) {
  var n2 = t2.innerRadius + (t2.outerRadius - t2.innerRadius) / 2;
  return M$1({}, t2, { innerRadius: n2, outerRadius: n2 });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  var n2 = t2.innerRadius + (t2.outerRadius - t2.innerRadius) / 2;
  return M$1({}, t2, { innerRadius: n2, outerRadius: n2 });
} }, outerRadius: { enter: function(t2) {
  return M$1({}, t2, { innerRadius: t2.outerRadius });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  return M$1({}, t2, { outerRadius: t2.innerRadius });
} }, pushIn: { enter: function(t2) {
  return M$1({}, t2, { innerRadius: t2.innerRadius - t2.outerRadius + t2.innerRadius, outerRadius: t2.innerRadius });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  return M$1({}, t2, { innerRadius: t2.outerRadius, outerRadius: t2.outerRadius + t2.outerRadius - t2.innerRadius });
} }, pushOut: { enter: function(t2) {
  return M$1({}, t2, { innerRadius: t2.outerRadius, outerRadius: t2.outerRadius + t2.outerRadius - t2.innerRadius });
}, update: function(t2) {
  return t2;
}, leave: function(t2) {
  return M$1({}, t2, { innerRadius: t2.innerRadius - t2.outerRadius + t2.innerRadius, outerRadius: t2.innerRadius });
} } }, I$1 = function(t2, n2) {
  return useMemo(function() {
    var e3 = E$5[t2];
    return { enter: function(t3) {
      return M$1({ progress: 0 }, e3.enter(t3.arc), n2 ? n2.enter(t3) : {});
    }, update: function(t3) {
      return M$1({ progress: 1 }, e3.update(t3.arc), n2 ? n2.update(t3) : {});
    }, leave: function(t3) {
      return M$1({ progress: 0 }, e3.leave(t3.arc), n2 ? n2.leave(t3) : {});
    } };
  }, [t2, n2]);
}, T$5 = function(t2, n2) {
  var e3 = Vt(t2) - Math.PI / 2, r2 = t2.innerRadius + (t2.outerRadius - t2.innerRadius) * n2;
  return Jt(e3, r2);
}, j$5 = function(t2) {
  return function(e3, r2, i2, a2) {
    return to([e3, r2, i2, a2], function(n2, e4, r3, i3) {
      var a3 = T$5({ startAngle: n2, endAngle: e4, innerRadius: r3, outerRadius: i3 }, t2);
      return "translate(" + a3.x + "," + a3.y + ")";
    });
  };
}, W$3 = function(t2, n2, r2, i2) {
  void 0 === n2 && (n2 = 0.5), void 0 === r2 && (r2 = "innerRadius");
  var a2 = Ur$1(), o2 = a2.animate, u2 = a2.config, l2 = I$1(r2, i2);
  return { transition: useTransition(t2, { keys: function(t3) {
    return t3.id;
  }, initial: l2.update, from: l2.enter, enter: l2.update, update: l2.update, leave: l2.leave, config: u2, immediate: !o2 }), interpolate: j$5(n2) };
}, B$2 = function(t2) {
  var n2 = t2.center, e3 = t2.data, r2 = t2.transitionMode, o2 = t2.label, u2 = t2.radiusOffset, l2 = t2.skipAngle, s = t2.textColor, f2 = t2.component, c2 = void 0 === f2 ? b$6 : f2, g2 = Wn(o2), h = zt$1(), x2 = Xe$1(s, h), m2 = useMemo(function() {
    return e3.filter(function(t3) {
      return Math.abs(Kt(t3.arc.endAngle - t3.arc.startAngle)) >= l2;
    });
  }, [e3, l2]), y2 = W$3(m2, u2, r2), k2 = y2.transition, C2 = y2.interpolate, L2 = c2;
  return jsx("g", { transform: "translate(" + n2[0] + "," + n2[1] + ")", children: k2(function(t3, n3) {
    return createElement(L2, { key: n3.id, datum: n3, label: g2(n3), style: M$1({}, t3, { transform: C2(t3.startAngle, t3.endAngle, t3.innerRadius, t3.outerRadius), textColor: x2(n3) }) });
  }) });
}, G = function(n2) {
  var e3 = n2.label, r2 = n2.style, a2 = zt$1();
  return jsxs(animated.g, { opacity: r2.opacity, children: [jsx(animated.path, { fill: "none", stroke: r2.linkColor, strokeWidth: r2.thickness, d: r2.path }), jsx(animated.text, { transform: r2.textPosition, textAnchor: r2.textAnchor, dominantBaseline: "central", style: M$1({}, a2.labels.text, { fill: r2.textColor }), children: e3 })] });
}, q$1 = function(t2) {
  var n2 = C$5(t2.startAngle + (t2.endAngle - t2.startAngle) / 2 - Math.PI / 2);
  return n2 < Math.PI / 2 || n2 > 1.5 * Math.PI ? "start" : "end";
}, D$1 = function(t2, n2, e3, r2) {
  var i2, a2, u2 = C$5(t2.startAngle + (t2.endAngle - t2.startAngle) / 2 - Math.PI / 2), l2 = Jt(u2, t2.outerRadius + n2), s = Jt(u2, t2.outerRadius + n2 + e3);
  return u2 < Math.PI / 2 || u2 > 1.5 * Math.PI ? (i2 = "after", a2 = { x: s.x + r2, y: s.y }) : (i2 = "before", a2 = { x: s.x - r2, y: s.y }), { side: i2, points: [l2, s, a2] };
}, H$3 = H$4().x(function(t2) {
  return t2.x;
}).y(function(t2) {
  return t2.y;
}), J$1 = function(t2, e3, r2, i2, a2, o2, u2) {
  return to([t2, e3, r2, i2, a2, o2, u2], function(t3, n2, e4, r3, i3, a3, o3) {
    var u3 = D$1({ startAngle: t3, endAngle: n2, innerRadius: e4, outerRadius: r3 }, i3, a3, o3).points;
    return H$3(u3);
  });
}, K$2 = function(t2, e3, r2, i2) {
  return to([t2, e3, r2, i2], function(t3, n2, e4, r3) {
    return q$1({ startAngle: t3, endAngle: n2, innerRadius: e4, outerRadius: r3 });
  });
}, N$4 = function(t2, e3, r2, i2, a2, o2, u2, l2) {
  return to([t2, e3, r2, i2, a2, o2, u2, l2], function(t3, n2, e4, r3, i3, a3, o3, u3) {
    var l3 = D$1({ startAngle: t3, endAngle: n2, innerRadius: e4, outerRadius: r3 }, i3, a3, o3), s = l3.points, d = l3.side, f2 = s[2];
    return "before" === d ? f2.x -= u3 : f2.x += u3, "translate(" + f2.x + "," + f2.y + ")";
  });
}, Q$3 = function(t2) {
  var n2 = t2.data, r2 = t2.offset, a2 = void 0 === r2 ? 0 : r2, o2 = t2.diagonalLength, u2 = t2.straightLength, l2 = t2.skipAngle, d = void 0 === l2 ? 0 : l2, f2 = t2.textOffset, c2 = t2.linkColor, g2 = t2.textColor, p2 = Ur$1(), h = p2.animate, A2 = p2.config, x2 = zt$1(), m2 = Xe$1(c2, x2), y2 = Xe$1(g2, x2), M2 = function(t3, n3) {
    return useMemo(function() {
      return L$2(t3, n3);
    }, [t3, n3]);
  }(n2, d), k2 = function(t3) {
    var n3 = t3.offset, e3 = t3.diagonalLength, r3 = t3.straightLength, i2 = t3.textOffset, a3 = t3.getLinkColor, o3 = t3.getTextColor;
    return useMemo(function() {
      return { enter: function(t4) {
        return { startAngle: t4.arc.startAngle, endAngle: t4.arc.endAngle, innerRadius: t4.arc.innerRadius, outerRadius: t4.arc.outerRadius, offset: n3, diagonalLength: 0, straightLength: 0, textOffset: i2, linkColor: a3(t4), textColor: o3(t4), opacity: 0 };
      }, update: function(t4) {
        return { startAngle: t4.arc.startAngle, endAngle: t4.arc.endAngle, innerRadius: t4.arc.innerRadius, outerRadius: t4.arc.outerRadius, offset: n3, diagonalLength: e3, straightLength: r3, textOffset: i2, linkColor: a3(t4), textColor: o3(t4), opacity: 1 };
      }, leave: function(t4) {
        return { startAngle: t4.arc.startAngle, endAngle: t4.arc.endAngle, innerRadius: t4.arc.innerRadius, outerRadius: t4.arc.outerRadius, offset: n3, diagonalLength: 0, straightLength: 0, textOffset: i2, linkColor: a3(t4), textColor: o3(t4), opacity: 0 };
      } };
    }, [e3, r3, i2, a3, o3, n3]);
  }({ offset: a2, diagonalLength: o2, straightLength: u2, textOffset: f2, getLinkColor: m2, getTextColor: y2 });
  return { transition: useTransition(M2, { keys: function(t3) {
    return t3.id;
  }, initial: k2.update, from: k2.enter, enter: k2.update, update: k2.update, leave: k2.leave, config: A2, immediate: !h }), interpolateLink: J$1, interpolateTextAnchor: K$2, interpolateTextPosition: N$4 };
}, U$2 = function(t2) {
  var n2 = t2.center, e3 = t2.data, r2 = t2.label, i2 = t2.skipAngle, a2 = t2.offset, o2 = t2.diagonalLength, u2 = t2.straightLength, l2 = t2.strokeWidth, s = t2.textOffset, f2 = t2.textColor, c2 = t2.linkColor, g2 = t2.component, h = void 0 === g2 ? G : g2, v2 = Wn(r2), x2 = Q$3({ data: e3, skipAngle: i2, offset: a2, diagonalLength: o2, straightLength: u2, textOffset: s, linkColor: c2, textColor: f2 }), R = x2.transition, m2 = x2.interpolateLink, y2 = x2.interpolateTextAnchor, k2 = x2.interpolateTextPosition, b2 = h;
  return jsx("g", { transform: "translate(" + n2[0] + "," + n2[1] + ")", children: R(function(t3, n3) {
    return createElement(b2, { key: n3.id, datum: n3, label: v2(n3), style: M$1({}, t3, { thickness: l2, path: m2(t3.startAngle, t3.endAngle, t3.innerRadius, t3.outerRadius, t3.offset, t3.diagonalLength, t3.straightLength), textAnchor: y2(t3.startAngle, t3.endAngle, t3.innerRadius, t3.outerRadius), textPosition: k2(t3.startAngle, t3.endAngle, t3.innerRadius, t3.outerRadius, t3.offset, t3.diagonalLength, t3.straightLength, t3.textOffset) }) });
  }) });
}, tt$1 = function(n2) {
  var e3 = n2.datum, r2 = n2.style, i2 = n2.onClick, a2 = n2.onMouseEnter, o2 = n2.onMouseMove, u2 = n2.onMouseLeave, l2 = useCallback(function(t2) {
    return null == i2 ? void 0 : i2(e3, t2);
  }, [i2, e3]), s = useCallback(function(t2) {
    return null == a2 ? void 0 : a2(e3, t2);
  }, [a2, e3]), d = useCallback(function(t2) {
    return null == o2 ? void 0 : o2(e3, t2);
  }, [o2, e3]), f2 = useCallback(function(t2) {
    return null == u2 ? void 0 : u2(e3, t2);
  }, [u2, e3]);
  return jsx(animated.path, { d: r2.path, opacity: r2.opacity, fill: e3.fill || r2.color, stroke: r2.borderColor, strokeWidth: r2.borderWidth, onClick: i2 ? l2 : void 0, onMouseEnter: a2 ? s : void 0, onMouseMove: o2 ? d : void 0, onMouseLeave: u2 ? f2 : void 0 });
}, nt = function(t2, e3, r2, i2, a2) {
  return to([t2, e3, r2, i2], function(t3, n2, e4, r3) {
    return a2({ startAngle: t3, endAngle: n2, innerRadius: Math.max(0, e4), outerRadius: Math.max(0, r3) });
  });
}, et = function(t2, n2, r2) {
  void 0 === n2 && (n2 = "innerRadius");
  var i2 = Ur$1(), a2 = i2.animate, o2 = i2.config, u2 = I$1(n2, r2);
  return { transition: useTransition(t2, { keys: function(t3) {
    return t3.id;
  }, initial: u2.update, from: u2.enter, enter: u2.update, update: u2.update, leave: u2.leave, config: o2, immediate: !a2 }), interpolate: nt };
}, rt$1 = function(t2) {
  var n2 = t2.center, e3 = t2.data, r2 = t2.arcGenerator, a2 = t2.borderWidth, o2 = t2.borderColor, u2 = t2.onClick, l2 = t2.onMouseEnter, s = t2.onMouseMove, d = t2.onMouseLeave, f2 = t2.transitionMode, c2 = t2.component, g2 = void 0 === c2 ? tt$1 : c2, h = zt$1(), v2 = Xe$1(o2, h), x2 = et(e3, f2, { enter: function(t3) {
    return { opacity: 0, color: t3.color, borderColor: v2(t3) };
  }, update: function(t3) {
    return { opacity: 1, color: t3.color, borderColor: v2(t3) };
  }, leave: function(t3) {
    return { opacity: 0, color: t3.color, borderColor: v2(t3) };
  } }), m2 = x2.transition, y2 = x2.interpolate, k2 = g2;
  return jsx("g", { transform: "translate(" + n2[0] + "," + n2[1] + ")", children: m2(function(t3, n3) {
    return createElement(k2, { key: n3.id, datum: n3, style: M$1({}, t3, { borderWidth: a2, path: y2(t3.startAngle, t3.endAngle, t3.innerRadius, t3.outerRadius, r2) }), onClick: u2, onMouseEnter: l2, onMouseMove: s, onMouseLeave: d });
  }) });
}, it = function(t2, n2, e3, r2, i2, a2) {
  void 0 === a2 && (a2 = true);
  var l2 = [], s = Jt(Ht$1(r2), e3);
  l2.push([s.x, s.y]);
  var d = Jt(Ht$1(i2), e3);
  l2.push([d.x, d.y]);
  for (var f2 = Math.round(Math.min(r2, i2)); f2 <= Math.round(Math.max(r2, i2)); f2++) if (f2 % 90 == 0) {
    var c2 = Jt(Ht$1(f2), e3);
    l2.push([c2.x, c2.y]);
  }
  l2 = l2.map(function(e4) {
    var r3 = e4[0], i3 = e4[1];
    return [t2 + r3, n2 + i3];
  }), a2 && l2.push([t2, n2]);
  var g2 = l2.map(function(t3) {
    return t3[0];
  }), p2 = l2.map(function(t3) {
    return t3[1];
  }), h = Math.min.apply(Math, g2), v2 = Math.max.apply(Math, g2), A2 = Math.min.apply(Math, p2);
  return { points: l2, x: h, y: A2, width: v2 - h, height: Math.max.apply(Math, p2) - A2 };
}, lt$1 = function(t2) {
  var n2 = void 0 === t2 ? {} : t2, e3 = n2.cornerRadius, r2 = void 0 === e3 ? 0 : e3, i2 = n2.padAngle, a2 = void 0 === i2 ? 0 : i2;
  return useMemo(function() {
    return y$1().innerRadius(function(t3) {
      return t3.innerRadius;
    }).outerRadius(function(t3) {
      return t3.outerRadius;
    }).cornerRadius(r2).padAngle(a2);
  }, [r2, a2]);
};
function qe$1() {
  return qe$1 = Object.assign ? Object.assign.bind() : function(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var n2 = arguments[r2];
      for (var t2 in n2) Object.prototype.hasOwnProperty.call(n2, t2) && (e3[t2] = n2[t2]);
    }
    return e3;
  }, qe$1.apply(this, arguments);
}
var Re$1 = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: e, accent: r, dark2: n, paired: t, pastel1: o, pastel2: i, set1: u$2, set2: a, set3: l, tableau10: c$2 }, Ve$1 = Object.keys(Re$1), Pe$1 = { brown_blueGreen: scheme$q, purpleRed_green: scheme$p, pink_yellowGreen: scheme$o, purple_orange: scheme$n, red_blue: scheme$m, red_grey: scheme$l, red_yellow_blue: scheme$k, red_yellow_green: scheme$j, spectral: scheme$i }, Te$1 = Object.keys(Pe$1), Ue$1 = { brown_blueGreen: v$6, purpleRed_green: _$3, pink_yellowGreen: w$5, purple_orange: k$5, red_blue: j$6, red_grey: A$2, red_yellow_blue: O$4, red_yellow_green: z$4, spectral: E$7 }, De$1 = { blues: scheme$5, greens: scheme$4, greys: scheme$3, oranges: scheme, purples: scheme$2, reds: scheme$1, blue_green: scheme$h, blue_purple: scheme$g, green_blue: scheme$f, orange_red: scheme$e, purple_blue_green: scheme$d, purple_blue: scheme$c, purple_red: scheme$b, red_purple: scheme$a, yellow_green_blue: scheme$9, yellow_green: scheme$8, yellow_orange_brown: scheme$7, yellow_orange_red: scheme$6 }, Me$1 = Object.keys(De$1), $e$1 = { blues: K$3, greens: L$3, greys: N$6, oranges: Q$4, purples: W$4, reds: X$5, turbo: Y$6, viridis: Z$2, inferno, magma, plasma, cividis: te$1, warm, cool, cubehelixDefault: ue$1, blue_green: ae$1, blue_purple: le$1, green_blue: ce$1, orange_red: se$1, purple_blue_green: fe$1, purple_blue: pe$1, purple_red: de$1, red_purple: me$1, yellow_green_blue: he$1, yellow_green: ge$1, yellow_orange_brown: ye, yellow_orange_red: be }, Be$1 = qe$1({}, Re$1, Pe$1, De$1), He$1 = function(e3) {
  return Ve$1.includes(e3);
}, Je$1 = function(e3) {
  return Te$1.includes(e3);
}, Ke$1 = function(e3) {
  return Me$1.includes(e3);
}, Le$1 = { rainbow: ve$1, sinebow: _e };
qe$1({}, Ue$1, $e$1, Le$1);
c$3.oneOfType([c$3.string, c$3.func, c$3.shape({ theme: c$3.string.isRequired }), c$3.shape({ from: c$3.string.isRequired, modifiers: c$3.arrayOf(c$3.array) })]);
var fr$1 = function(e3, r2) {
  if ("function" == typeof e3) return e3;
  var n2 = function(e4) {
    return y$2(e4, r2);
  };
  if (Array.isArray(e3)) {
    var t2 = ordinal(e3), o2 = function(e4) {
      return t2(n2(e4));
    };
    return o2.scale = t2, o2;
  }
  if (je(e3)) {
    if (function(e4) {
      return void 0 !== e4.datum;
    }(e3)) return function(r3) {
      return y$2(r3, e3.datum);
    };
    if (function(e4) {
      return void 0 !== e4.scheme;
    }(e3)) {
      if (He$1(e3.scheme)) {
        var i2 = ordinal(Be$1[e3.scheme]), u2 = function(e4) {
          return i2(n2(e4));
        };
        return u2.scale = i2, u2;
      }
      if (Je$1(e3.scheme)) {
        if (void 0 !== e3.size && (e3.size < 3 || e3.size > 11)) throw new Error("Invalid size '" + e3.size + "' for diverging color scheme '" + e3.scheme + "', must be between 3~11");
        var a2 = ordinal(Be$1[e3.scheme][e3.size || 11]), l2 = function(e4) {
          return a2(n2(e4));
        };
        return l2.scale = a2, l2;
      }
      if (Ke$1(e3.scheme)) {
        if (void 0 !== e3.size && (e3.size < 3 || e3.size > 9)) throw new Error("Invalid size '" + e3.size + "' for sequential color scheme '" + e3.scheme + "', must be between 3~9");
        var c2 = ordinal(Be$1[e3.scheme][e3.size || 9]), s = function(e4) {
          return c2(n2(e4));
        };
        return s.scale = c2, s;
      }
    }
    throw new Error("Invalid colors, when using an object, you should either pass a 'datum' or a 'scheme' property");
  }
  return function() {
    return e3;
  };
}, pr$1 = function(e3, r2) {
  return useMemo(function() {
    return fr$1(e3, r2);
  }, [e3, r2]);
};
var f$1 = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("circle", { r: o2 / 2, cx: i2 + o2 / 2, cy: n2 + o2 / 2, fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, style: { pointerEvents: "none" } });
}, m$4 = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("g", { transform: "translate(" + i2 + "," + n2 + ")", children: jsx("path", { d: "\n                    M" + o2 / 2 + " 0\n                    L" + 0.8 * o2 + " " + o2 / 2 + "\n                    L" + o2 / 2 + " " + o2 + "\n                    L" + 0.2 * o2 + " " + o2 / 2 + "\n                    L" + o2 / 2 + " 0\n                ", fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, style: { pointerEvents: "none" } }) });
}, v$4 = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("rect", { x: i2, y: n2, fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, width: o2, height: o2, style: { pointerEvents: "none" } });
}, u$1 = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("g", { transform: "translate(" + i2 + "," + n2 + ")", children: jsx("path", { d: "\n                M" + o2 / 2 + " 0\n                L" + o2 + " " + o2 + "\n                L0 " + o2 + "\n                L" + o2 / 2 + " 0\n            ", fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, style: { pointerEvents: "none" } }) });
};
function p$2() {
  return p$2 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var e3 = 1; e3 < arguments.length; e3++) {
      var i2 = arguments[e3];
      for (var n2 in i2) Object.prototype.hasOwnProperty.call(i2, n2) && (t2[n2] = i2[n2]);
    }
    return t2;
  }, p$2.apply(this, arguments);
}
var k$3 = { top: 0, right: 0, bottom: 0, left: 0 }, x$4 = function(t2) {
  var e3, i2 = t2.direction, n2 = t2.itemsSpacing, o2 = t2.padding, r2 = t2.itemCount, l2 = t2.itemWidth, a2 = t2.itemHeight;
  if ("number" != typeof o2 && ("object" != typeof (e3 = o2) || Array.isArray(e3) || null === e3)) throw new Error("Invalid property padding, must be one of: number, object");
  var c2 = "number" == typeof o2 ? { top: o2, right: o2, bottom: o2, left: o2 } : p$2({}, k$3, o2), d = c2.left + c2.right, s = c2.top + c2.bottom, h = l2 + d, g2 = a2 + s, f2 = (r2 - 1) * n2;
  return "row" === i2 ? h = l2 * r2 + f2 + d : "column" === i2 && (g2 = a2 * r2 + f2 + s), { width: h, height: g2, padding: c2 };
}, b$5 = function(t2) {
  var e3 = t2.anchor, i2 = t2.translateX, n2 = t2.translateY, o2 = t2.containerWidth, r2 = t2.containerHeight, l2 = t2.width, a2 = t2.height, c2 = i2, d = n2;
  switch (e3) {
    case "top":
      c2 += (o2 - l2) / 2;
      break;
    case "top-right":
      c2 += o2 - l2;
      break;
    case "right":
      c2 += o2 - l2, d += (r2 - a2) / 2;
      break;
    case "bottom-right":
      c2 += o2 - l2, d += r2 - a2;
      break;
    case "bottom":
      c2 += (o2 - l2) / 2, d += r2 - a2;
      break;
    case "bottom-left":
      d += r2 - a2;
      break;
    case "left":
      d += (r2 - a2) / 2;
      break;
    case "center":
      c2 += (o2 - l2) / 2, d += (r2 - a2) / 2;
  }
  return { x: c2, y: d };
}, S$2 = function(t2) {
  var e3, i2, n2, o2, r2, l2, a2 = t2.direction, c2 = t2.justify, d = t2.symbolSize, s = t2.symbolSpacing, h = t2.width, g2 = t2.height;
  switch (a2) {
    case "left-to-right":
      e3 = 0, i2 = (g2 - d) / 2, o2 = g2 / 2, l2 = "central", c2 ? (n2 = h, r2 = "end") : (n2 = d + s, r2 = "start");
      break;
    case "right-to-left":
      e3 = h - d, i2 = (g2 - d) / 2, o2 = g2 / 2, l2 = "central", c2 ? (n2 = 0, r2 = "start") : (n2 = h - d - s, r2 = "end");
      break;
    case "top-to-bottom":
      e3 = (h - d) / 2, i2 = 0, n2 = h / 2, r2 = "middle", c2 ? (o2 = g2, l2 = "alphabetic") : (o2 = d + s, l2 = "text-before-edge");
      break;
    case "bottom-to-top":
      e3 = (h - d) / 2, i2 = g2 - d, n2 = h / 2, r2 = "middle", c2 ? (o2 = 0, l2 = "text-before-edge") : (o2 = g2 - d - s, l2 = "alphabetic");
  }
  return { symbolX: e3, symbolY: i2, labelX: n2, labelY: o2, labelAnchor: r2, labelAlignment: l2 };
}, w$4 = { circle: f$1, diamond: m$4, square: v$4, triangle: u$1 }, X$4 = function(i2) {
  var n2, l2, a2, d, g2, f2, m2, v2, u2, y2, k2, x2 = i2.x, b2 = i2.y, A2 = i2.width, W2 = i2.height, z2 = i2.data, C2 = i2.direction, X2 = void 0 === C2 ? "left-to-right" : C2, Y2 = i2.justify, O2 = void 0 !== Y2 && Y2, B2 = i2.textColor, H2 = i2.background, E2 = void 0 === H2 ? "transparent" : H2, j2 = i2.opacity, L2 = void 0 === j2 ? 1 : j2, M2 = i2.symbolShape, F2 = void 0 === M2 ? "square" : M2, T2 = i2.symbolSize, P2 = void 0 === T2 ? 16 : T2, V2 = i2.symbolSpacing, R = void 0 === V2 ? 8 : V2, D2 = i2.symbolBorderWidth, q2 = void 0 === D2 ? 0 : D2, G2 = i2.symbolBorderColor, I2 = void 0 === G2 ? "transparent" : G2, N2 = i2.onClick, _2 = i2.onMouseEnter, J2 = i2.onMouseLeave, K2 = i2.toggleSerie, Q2 = i2.effects, U2 = useState({}), Z2 = U2[0], $2 = U2[1], tt2 = zt$2(), et2 = useCallback(function(t2) {
    if (Q2) {
      var e3 = Q2.filter(function(t3) {
        return "hover" === t3.on;
      }).reduce(function(t3, e4) {
        return p$2({}, t3, e4.style);
      }, {});
      $2(e3);
    }
    null == _2 || _2(z2, t2);
  }, [_2, z2, Q2]), it2 = useCallback(function(t2) {
    if (Q2) {
      var e3 = Q2.filter(function(t3) {
        return "hover" !== t3.on;
      }).reduce(function(t3, e4) {
        return p$2({}, t3, e4.style);
      }, {});
      $2(e3);
    }
    null == J2 || J2(z2, t2);
  }, [J2, z2, Q2]), nt2 = S$2({ direction: X2, justify: O2, symbolSize: null != (n2 = Z2.symbolSize) ? n2 : P2, symbolSpacing: R, width: A2, height: W2 }), ot = nt2.symbolX, rt2 = nt2.symbolY, lt2 = nt2.labelX, at = nt2.labelY, ct = nt2.labelAnchor, dt = nt2.labelAlignment, st = [N2, _2, J2, K2].some(function(t2) {
    return void 0 !== t2;
  }), ht2 = "function" == typeof F2 ? F2 : w$4[F2];
  return jsxs("g", { transform: "translate(" + x2 + "," + b2 + ")", style: { opacity: null != (l2 = Z2.itemOpacity) ? l2 : L2 }, children: [jsx("rect", { width: A2, height: W2, fill: null != (a2 = Z2.itemBackground) ? a2 : E2, style: { cursor: st ? "pointer" : "auto" }, onClick: function(t2) {
    null == N2 || N2(z2, t2), null == K2 || K2(z2.id);
  }, onMouseEnter: et2, onMouseLeave: it2 }), React.createElement(ht2, p$2({ id: z2.id, x: ot, y: rt2, size: null != (d = Z2.symbolSize) ? d : P2, fill: null != (g2 = null != (f2 = z2.fill) ? f2 : z2.color) ? g2 : "black", borderWidth: null != (m2 = Z2.symbolBorderWidth) ? m2 : q2, borderColor: null != (v2 = Z2.symbolBorderColor) ? v2 : I2 }, z2.hidden ? tt2.legends.hidden.symbol : void 0)), jsx("text", { textAnchor: ct, style: p$2({}, Mt$2(tt2.legends.text), { fill: null != (u2 = null != (y2 = null != (k2 = Z2.itemTextColor) ? k2 : B2) ? y2 : tt2.legends.text.fill) ? u2 : "black", dominantBaseline: dt, pointerEvents: "none", userSelect: "none" }, z2.hidden ? tt2.legends.hidden.text : void 0), x: lt2, y: at, children: z2.label })] });
}, Y$4 = function(e3) {
  var i2 = e3.data, n2 = e3.x, o2 = e3.y, r2 = e3.direction, l2 = e3.padding, a2 = void 0 === l2 ? 0 : l2, c2 = e3.justify, d = e3.effects, s = e3.itemWidth, h = e3.itemHeight, g2 = e3.itemDirection, f2 = void 0 === g2 ? "left-to-right" : g2, m2 = e3.itemsSpacing, v2 = void 0 === m2 ? 0 : m2, u2 = e3.itemTextColor, p2 = e3.itemBackground, y2 = void 0 === p2 ? "transparent" : p2, k2 = e3.itemOpacity, b2 = void 0 === k2 ? 1 : k2, S2 = e3.symbolShape, A2 = e3.symbolSize, W2 = e3.symbolSpacing, z2 = e3.symbolBorderWidth, C2 = e3.symbolBorderColor, w2 = e3.onClick, Y2 = e3.onMouseEnter, O2 = e3.onMouseLeave, B2 = e3.toggleSerie, H2 = x$4({ itemCount: i2.length, itemWidth: s, itemHeight: h, itemsSpacing: v2, direction: r2, padding: a2 }).padding, E2 = "row" === r2 ? s + v2 : 0, j2 = "column" === r2 ? h + v2 : 0;
  return jsx("g", { transform: "translate(" + n2 + "," + o2 + ")", children: i2.map(function(e4, i3) {
    return jsx(X$4, { data: e4, x: i3 * E2 + H2.left, y: i3 * j2 + H2.top, width: s, height: h, direction: f2, justify: c2, effects: d, textColor: u2, background: y2, opacity: b2, symbolShape: S2, symbolSize: A2, symbolSpacing: W2, symbolBorderWidth: z2, symbolBorderColor: C2, onClick: w2, onMouseEnter: Y2, onMouseLeave: O2, toggleSerie: B2 }, i3);
  }) });
}, O$3 = function(e3) {
  var i2 = e3.data, n2 = e3.containerWidth, o2 = e3.containerHeight, r2 = e3.translateX, l2 = void 0 === r2 ? 0 : r2, a2 = e3.translateY, c2 = void 0 === a2 ? 0 : a2, d = e3.anchor, s = e3.direction, h = e3.padding, g2 = void 0 === h ? 0 : h, f2 = e3.justify, m2 = e3.itemsSpacing, v2 = void 0 === m2 ? 0 : m2, u2 = e3.itemWidth, p2 = e3.itemHeight, y2 = e3.itemDirection, k2 = e3.itemTextColor, S2 = e3.itemBackground, A2 = e3.itemOpacity, W2 = e3.symbolShape, z2 = e3.symbolSize, C2 = e3.symbolSpacing, w2 = e3.symbolBorderWidth, X2 = e3.symbolBorderColor, O2 = e3.onClick, B2 = e3.onMouseEnter, H2 = e3.onMouseLeave, E2 = e3.toggleSerie, j2 = e3.effects, L2 = x$4({ itemCount: i2.length, itemsSpacing: v2, itemWidth: u2, itemHeight: p2, direction: s, padding: g2 }), M2 = L2.width, F2 = L2.height, T2 = b$5({ anchor: d, translateX: l2, translateY: c2, containerWidth: n2, containerHeight: o2, width: M2, height: F2 }), P2 = T2.x, V2 = T2.y;
  return jsx(Y$4, { data: i2, x: P2, y: V2, direction: s, padding: g2, justify: f2, effects: j2, itemsSpacing: v2, itemWidth: u2, itemHeight: p2, itemDirection: y2, itemTextColor: k2, itemBackground: S2, itemOpacity: A2, symbolShape: W2, symbolSize: z2, symbolSpacing: C2, symbolBorderWidth: w2, symbolBorderColor: X2, onClick: O2, onMouseEnter: B2, onMouseLeave: H2, toggleSerie: "boolean" == typeof E2 ? void 0 : E2 });
};
function E$4() {
  return E$4 = Object.assign ? Object.assign.bind() : function(e3) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var i2 = arguments[t2];
      for (var n2 in i2) Object.prototype.hasOwnProperty.call(i2, n2) && (e3[n2] = i2[n2]);
    }
    return e3;
  }, E$4.apply(this, arguments);
}
function F$1(e3, t2) {
  if (null == e3) return {};
  var i2, n2, a2 = {}, r2 = Object.keys(e3);
  for (n2 = 0; n2 < r2.length; n2++) i2 = r2[n2], t2.indexOf(i2) >= 0 || (a2[i2] = e3[i2]);
  return a2;
}
var H$2, X$3 = function(e3) {
  var t2 = e3.width, i2 = e3.height, n2 = e3.legends, a2 = e3.data, r2 = e3.toggleSerie;
  return jsx(Fragment, { children: n2.map(function(e4, n3) {
    var o2;
    return jsx(O$3, E$4({}, e4, { containerWidth: t2, containerHeight: i2, data: null != (o2 = e4.data) ? o2 : a2, toggleSerie: e4.toggleSerie ? r2 : void 0 }), n3);
  }) });
}, Y$3 = { id: "id", value: "value", sortByValue: false, innerRadius: 0, padAngle: 0, cornerRadius: 0, layers: ["arcs", "arcLinkLabels", "arcLabels", "legends"], startAngle: 0, endAngle: 360, fit: true, activeInnerRadiusOffset: 0, activeOuterRadiusOffset: 0, borderWidth: 0, borderColor: { from: "color", modifiers: [["darker", 1]] }, enableArcLabels: true, arcLabel: "formattedValue", arcLabelsSkipAngle: 0, arcLabelsRadiusOffset: 0.5, arcLabelsTextColor: { theme: "labels.text.fill" }, enableArcLinkLabels: true, arcLinkLabel: "id", arcLinkLabelsSkipAngle: 0, arcLinkLabelsOffset: 0, arcLinkLabelsDiagonalLength: 16, arcLinkLabelsStraightLength: 24, arcLinkLabelsThickness: 1, arcLinkLabelsTextOffset: 6, arcLinkLabelsTextColor: { theme: "labels.text.fill" }, arcLinkLabelsColor: { theme: "axis.ticks.line.stroke" }, colors: { scheme: "nivo" }, defs: [], fill: [], isInteractive: true, animate: true, motionConfig: "gentle", transitionMode: "innerRadius", tooltip: function(e3) {
  var t2 = e3.datum;
  return jsx(w$6, { id: t2.id, value: t2.formattedValue, enableChip: true, color: t2.color });
}, legends: [], role: "img", pixelRatio: "undefined" != typeof window && null != (H$2 = window.devicePixelRatio) ? H$2 : 1 }, j$4 = ["points"], P$5 = function(t2) {
  var i2 = t2.data, n2 = t2.id, a2 = void 0 === n2 ? Y$3.id : n2, r2 = t2.value, o2 = void 0 === r2 ? Y$3.value : r2, s = t2.valueFormat, c2 = t2.colors, u2 = void 0 === c2 ? Y$3.colors : c2, v2 = Wn$1(a2), f2 = Wn$1(o2), g2 = Ot$2(s), L2 = pr$1(u2, "id");
  return useMemo(function() {
    return i2.map(function(e3) {
      var t3, i3 = v2(e3), n3 = f2(e3), a3 = { id: i3, label: null != (t3 = e3.label) ? t3 : i3, hidden: false, value: n3, formattedValue: g2(n3), data: e3 };
      return E$4({}, a3, { color: L2(a3) });
    });
  }, [i2, v2, f2, g2, L2]);
}, q = function(n2) {
  var a2 = n2.data, r2 = n2.startAngle, o2 = n2.endAngle, d = n2.innerRadius, l2 = n2.outerRadius, u2 = n2.padAngle, v2 = n2.sortByValue, f2 = n2.activeId, g2 = n2.activeInnerRadiusOffset, L2 = n2.activeOuterRadiusOffset, h = n2.hiddenIds, b2 = n2.forwardLegendData, A2 = useMemo(function() {
    var e3 = T$7().value(function(e4) {
      return e4.value;
    }).startAngle(Ht$2(r2)).endAngle(Ht$2(o2)).padAngle(Ht$2(u2));
    return v2 || e3.sortValues(null), e3;
  }, [r2, o2, u2, v2]), p2 = useMemo(function() {
    var e3 = a2.filter(function(e4) {
      return !h.includes(e4.id);
    });
    return { dataWithArc: A2(e3).map(function(e4) {
      var t2 = Math.abs(e4.endAngle - e4.startAngle);
      return E$4({}, e4.data, { arc: { index: e4.index, startAngle: e4.startAngle, endAngle: e4.endAngle, innerRadius: f2 === e4.data.id ? d - g2 : d, outerRadius: f2 === e4.data.id ? l2 + L2 : l2, thickness: l2 - d, padAngle: e4.padAngle, angle: t2, angleDeg: Kt$1(t2) } });
    }), legendData: a2.map(function(e4) {
      return { id: e4.id, label: e4.label, color: e4.color, hidden: h.includes(e4.id), data: e4 };
    }) };
  }, [A2, a2, h, f2, d, g2, l2, L2]), k2 = p2.legendData, I2 = useRef(b2);
  return useEffect(function() {
    "function" == typeof I2.current && I2.current(k2);
  }, [I2, k2]), p2;
}, z$3 = function(e3) {
  var t2 = e3.activeId, i2 = e3.onActiveIdChange, r2 = e3.defaultActiveId, o2 = void 0 !== t2, d = useState(o2 ? null : void 0 === r2 ? null : r2), l2 = d[0], s = d[1];
  return { activeId: o2 ? t2 : l2, setActiveId: useCallback(function(e4) {
    i2 && i2(e4), o2 || s(e4);
  }, [o2, i2, s]) };
}, K$1 = function(t2) {
  var i2 = t2.data, r2 = t2.width, o2 = t2.height, d = t2.innerRadius, l2 = void 0 === d ? Y$3.innerRadius : d, c2 = t2.startAngle, u2 = void 0 === c2 ? Y$3.startAngle : c2, v2 = t2.endAngle, f2 = void 0 === v2 ? Y$3.endAngle : v2, g2 = t2.padAngle, L2 = void 0 === g2 ? Y$3.padAngle : g2, h = t2.sortByValue, b2 = void 0 === h ? Y$3.sortByValue : h, k2 = t2.cornerRadius, I2 = void 0 === k2 ? Y$3.cornerRadius : k2, R = t2.fit, m2 = void 0 === R ? Y$3.fit : R, O2 = t2.activeInnerRadiusOffset, C2 = void 0 === O2 ? Y$3.activeInnerRadiusOffset : O2, x2 = t2.activeOuterRadiusOffset, w2 = void 0 === x2 ? Y$3.activeOuterRadiusOffset : x2, M2 = t2.activeId, y2 = t2.onActiveIdChange, W2 = t2.defaultActiveId, S2 = t2.forwardLegendData, T2 = z$3({ activeId: M2, onActiveIdChange: y2, defaultActiveId: W2 }), D2 = T2.activeId, V2 = T2.setActiveId, B2 = useState([]), G2 = B2[0], H2 = B2[1], X2 = useMemo(function() {
    var e3, t3 = Math.min(r2, o2) / 2, i3 = t3 * Math.min(l2, 1), n2 = r2 / 2, a2 = o2 / 2;
    if (m2) {
      var d2 = it(n2, a2, t3, u2 - 90, f2 - 90), s = d2.points, c3 = F$1(d2, j$4), v3 = Math.min(r2 / c3.width, o2 / c3.height), g3 = { width: c3.width * v3, height: c3.height * v3 };
      g3.x = (r2 - g3.width) / 2, g3.y = (o2 - g3.height) / 2, n2 = (n2 - c3.x) / c3.width * c3.width * v3 + g3.x, a2 = (a2 - c3.y) / c3.height * c3.height * v3 + g3.y, e3 = { box: c3, ratio: v3, points: s }, t3 *= v3, i3 *= v3;
    }
    return { centerX: n2, centerY: a2, radius: t3, innerRadius: i3, debug: e3 };
  }, [r2, o2, l2, u2, f2, m2]), P2 = q({ data: i2, startAngle: u2, endAngle: f2, innerRadius: X2.innerRadius, outerRadius: X2.radius, padAngle: L2, sortByValue: b2, activeId: D2, activeInnerRadiusOffset: C2, activeOuterRadiusOffset: w2, hiddenIds: G2, forwardLegendData: S2 }), J2 = useCallback(function(e3) {
    H2(function(t3) {
      return t3.indexOf(e3) > -1 ? t3.filter(function(t4) {
        return t4 !== e3;
      }) : [].concat(t3, [e3]);
    });
  }, []);
  return E$4({ arcGenerator: lt$1({ cornerRadius: I2, padAngle: Ht$2(L2) }), activeId: D2, setActiveId: V2, toggleSerie: J2 }, P2, X2);
}, N$3 = function(t2) {
  var i2 = t2.dataWithArc, n2 = t2.arcGenerator, a2 = t2.centerX, r2 = t2.centerY, o2 = t2.radius, d = t2.innerRadius;
  return useMemo(function() {
    return { dataWithArc: i2, arcGenerator: n2, centerX: a2, centerY: r2, radius: o2, innerRadius: d };
  }, [i2, n2, a2, r2, o2, d]);
}, Q$2 = function(t2) {
  var i2 = t2.center, n2 = t2.data, a2 = t2.arcGenerator, o2 = t2.borderWidth, d = t2.borderColor, l2 = t2.isInteractive, s = t2.onClick, c2 = t2.onMouseEnter, u2 = t2.onMouseMove, v2 = t2.onMouseLeave, f2 = t2.setActiveId, g2 = t2.tooltip, L2 = t2.transitionMode, h = k$6(), b2 = h.showTooltipFromEvent, A2 = h.hideTooltip, p2 = useMemo(function() {
    if (l2) return function(e3, t3) {
      null == s || s(e3, t3);
    };
  }, [l2, s]), I2 = useMemo(function() {
    if (l2) return function(e3, t3) {
      b2(createElement(g2, { datum: e3 }), t3), f2(e3.id), null == c2 || c2(e3, t3);
    };
  }, [l2, b2, f2, c2, g2]), R = useMemo(function() {
    if (l2) return function(e3, t3) {
      b2(createElement(g2, { datum: e3 }), t3), null == u2 || u2(e3, t3);
    };
  }, [l2, b2, u2, g2]), m2 = useMemo(function() {
    if (l2) return function(e3, t3) {
      A2(), f2(null), null == v2 || v2(e3, t3);
    };
  }, [l2, A2, f2, v2]);
  return jsx(rt$1, { center: i2, data: n2, arcGenerator: a2, borderWidth: o2, borderColor: d, transitionMode: L2, onClick: p2, onMouseEnter: I2, onMouseMove: R, onMouseLeave: m2 });
}, U$1 = ["isInteractive", "animate", "motionConfig", "theme", "renderWrapper"], Z$1 = function(e3) {
  var t2 = e3.data, i2 = e3.id, n2 = void 0 === i2 ? Y$3.id : i2, a2 = e3.value, d = void 0 === a2 ? Y$3.value : a2, l2 = e3.valueFormat, s = e3.sortByValue, c2 = void 0 === s ? Y$3.sortByValue : s, u2 = e3.layers, L2 = void 0 === u2 ? Y$3.layers : u2, h = e3.startAngle, b2 = void 0 === h ? Y$3.startAngle : h, A2 = e3.endAngle, p2 = void 0 === A2 ? Y$3.endAngle : A2, k2 = e3.padAngle, m2 = void 0 === k2 ? Y$3.padAngle : k2, O2 = e3.fit, C2 = void 0 === O2 ? Y$3.fit : O2, x2 = e3.innerRadius, w2 = void 0 === x2 ? Y$3.innerRadius : x2, M2 = e3.cornerRadius, y2 = void 0 === M2 ? Y$3.cornerRadius : M2, S2 = e3.activeInnerRadiusOffset, T2 = void 0 === S2 ? Y$3.activeInnerRadiusOffset : S2, D2 = e3.activeOuterRadiusOffset, V2 = void 0 === D2 ? Y$3.activeOuterRadiusOffset : D2, B2 = e3.width, G2 = e3.height, E2 = e3.margin, F2 = e3.colors, H2 = void 0 === F2 ? Y$3.colors : F2, j2 = e3.borderWidth, q2 = void 0 === j2 ? Y$3.borderWidth : j2, z2 = e3.borderColor, J2 = void 0 === z2 ? Y$3.borderColor : z2, U2 = e3.enableArcLabels, Z2 = void 0 === U2 ? Y$3.enableArcLabels : U2, $2 = e3.arcLabel, _2 = void 0 === $2 ? Y$3.arcLabel : $2, ee = e3.arcLabelsSkipAngle, te2 = void 0 === ee ? Y$3.arcLabelsSkipAngle : ee, ie2 = e3.arcLabelsTextColor, ne2 = void 0 === ie2 ? Y$3.arcLabelsTextColor : ie2, ae2 = e3.arcLabelsRadiusOffset, re2 = void 0 === ae2 ? Y$3.arcLabelsRadiusOffset : ae2, oe2 = e3.arcLabelsComponent, de2 = e3.enableArcLinkLabels, le2 = void 0 === de2 ? Y$3.enableArcLinkLabels : de2, se2 = e3.arcLinkLabel, ce2 = void 0 === se2 ? Y$3.arcLinkLabel : se2, ue2 = e3.arcLinkLabelsSkipAngle, ve2 = void 0 === ue2 ? Y$3.arcLinkLabelsSkipAngle : ue2, fe2 = e3.arcLinkLabelsOffset, ge2 = void 0 === fe2 ? Y$3.arcLinkLabelsOffset : fe2, Le2 = e3.arcLinkLabelsDiagonalLength, he2 = void 0 === Le2 ? Y$3.arcLinkLabelsDiagonalLength : Le2, be2 = e3.arcLinkLabelsStraightLength, Ae = void 0 === be2 ? Y$3.arcLinkLabelsStraightLength : be2, pe2 = e3.arcLinkLabelsThickness, ke = void 0 === pe2 ? Y$3.arcLinkLabelsThickness : pe2, Ie = e3.arcLinkLabelsTextOffset, Re2 = void 0 === Ie ? Y$3.arcLinkLabelsTextOffset : Ie, me2 = e3.arcLinkLabelsTextColor, Oe = void 0 === me2 ? Y$3.arcLinkLabelsTextColor : me2, Ce2 = e3.arcLinkLabelsColor, xe = void 0 === Ce2 ? Y$3.arcLinkLabelsColor : Ce2, we = e3.arcLinkLabelComponent, Me2 = e3.defs, ye2 = void 0 === Me2 ? Y$3.defs : Me2, We2 = e3.fill, Se = void 0 === We2 ? Y$3.fill : We2, Te2 = e3.isInteractive, De2 = void 0 === Te2 ? Y$3.isInteractive : Te2, Ve2 = e3.onClick, Be2 = e3.onMouseEnter, Ge2 = e3.onMouseMove, Ee = e3.onMouseLeave, Fe = e3.tooltip, He2 = void 0 === Fe ? Y$3.tooltip : Fe, Xe2 = e3.activeId, Ye = e3.onActiveIdChange, je2 = e3.defaultActiveId, Pe2 = e3.transitionMode, qe2 = void 0 === Pe2 ? Y$3.transitionMode : Pe2, ze = e3.legends, Je2 = void 0 === ze ? Y$3.legends : ze, Ke2 = e3.forwardLegendData, Ne = e3.role, Qe2 = void 0 === Ne ? Y$3.role : Ne, Ue2 = wt$1(B2, G2, E2), Ze2 = Ue2.outerWidth, $e2 = Ue2.outerHeight, _e2 = Ue2.margin, et2 = Ue2.innerWidth, tt2 = Ue2.innerHeight, it2 = P$5({ data: t2, id: n2, value: d, valueFormat: l2, colors: H2 }), nt2 = K$1({ data: it2, width: et2, height: tt2, fit: C2, innerRadius: w2, startAngle: b2, endAngle: p2, padAngle: m2, sortByValue: c2, cornerRadius: y2, activeInnerRadiusOffset: T2, activeOuterRadiusOffset: V2, activeId: Xe2, onActiveIdChange: Ye, defaultActiveId: je2, forwardLegendData: Ke2 }), at = nt2.dataWithArc, rt2 = nt2.legendData, ot = nt2.arcGenerator, dt = nt2.centerX, lt2 = nt2.centerY, st = nt2.radius, ct = nt2.innerRadius, ut = nt2.setActiveId, vt = nt2.toggleSerie, ft = In$1(ye2, at, Se), gt = { arcs: null, arcLinkLabels: null, arcLabels: null, legends: null };
  L2.includes("arcs") && (gt.arcs = jsx(Q$2, { center: [dt, lt2], data: at, arcGenerator: ot, borderWidth: q2, borderColor: J2, isInteractive: De2, onClick: Ve2, onMouseEnter: Be2, onMouseMove: Ge2, onMouseLeave: Ee, setActiveId: ut, tooltip: He2, transitionMode: qe2 }, "arcs")), le2 && L2.includes("arcLinkLabels") && (gt.arcLinkLabels = jsx(U$2, { center: [dt, lt2], data: at, label: ce2, skipAngle: ve2, offset: ge2, diagonalLength: he2, straightLength: Ae, strokeWidth: ke, textOffset: Re2, textColor: Oe, linkColor: xe, component: we }, "arcLinkLabels")), Z2 && L2.includes("arcLabels") && (gt.arcLabels = jsx(B$2, { center: [dt, lt2], data: at, label: _2, radiusOffset: re2, skipAngle: te2, textColor: ne2, transitionMode: qe2, component: oe2 }, "arcLabels")), Je2.length > 0 && L2.includes("legends") && (gt.legends = jsx(X$3, { width: et2, height: tt2, data: rt2, legends: Je2, toggleSerie: vt }, "legends"));
  var Lt = N$3({ dataWithArc: at, arcGenerator: ot, centerX: dt, centerY: lt2, radius: st, innerRadius: ct });
  return jsx(gn$2, { width: Ze2, height: $e2, margin: _e2, defs: ft, role: Qe2, children: L2.map(function(e4, t3) {
    return void 0 !== gt[e4] ? gt[e4] : "function" == typeof e4 ? jsx(Fragment$1, { children: createElement(e4, Lt) }, t3) : null;
  }) });
}, $$2 = function(e3) {
  var t2 = e3.isInteractive, i2 = void 0 === t2 ? Y$3.isInteractive : t2, n2 = e3.animate, a2 = void 0 === n2 ? Y$3.animate : n2, r2 = e3.motionConfig, o2 = void 0 === r2 ? Y$3.motionConfig : r2, d = e3.theme, l2 = e3.renderWrapper, s = F$1(e3, U$1);
  return jsx(St$1, { animate: a2, isInteractive: i2, motionConfig: o2, renderWrapper: l2, theme: d, children: jsx(Z$1, E$4({ isInteractive: i2 }, s)) });
}, _$2 = function(e3) {
  return jsx(It$1, { children: function(t2) {
    var i2 = t2.width, n2 = t2.height;
    return jsx($$2, E$4({ width: i2, height: n2 }, e3));
  } });
};
const formatPricePDF = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);
};
const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10
  },
  header: {
    fontSize: 24,
    marginBottom: 0,
    textAlign: "center",
    color: "#333",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf"
  },
  subHeader: {
    fontSize: 18,
    color: "#666"
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 10
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    alignItems: "center"
  },
  tableHeader: {
    backgroundColor: "#f0f0f0"
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid"
  },
  metric: {
    fontSize: 12,
    marginBottom: 5
  },
  row: {
    flexDirection: "row"
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold"
  },
  cell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid"
  },
  footerText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10
  },
  footerLine: {
    width: "100%",
    marginLeft: 50,
    marginRight: 50
  },
  headerLine: {
    width: "100%",
    marginBottom: 5
  }
});
const HeaderSection = ({
  userName,
  date: date2
}) => /* @__PURE__ */ jsxs(View, { style: styles.section, children: [
  /* @__PURE__ */ jsx(Text, { style: [styles.header, styles.headerLine], children: "Chrono - Portfolio Performance Report" }),
  /* @__PURE__ */ jsxs(Text, { style: styles.subHeader, children: [
    "Generated for: ",
    userName
  ] }),
  /* @__PURE__ */ jsxs(Text, { style: styles.metric, children: [
    "Date: ",
    new Date(date2).toLocaleDateString()
  ] }),
  /* @__PURE__ */ jsxs(Text, { style: styles.metric, children: [
    "Time:",
    " ",
    new Date(date2).toLocaleTimeString("en-US", {
      timeZone: "America/New_York"
    }),
    " ",
    new Date(date2).toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      timeZoneName: "short"
    }).split(" ")[2]
  ] })
] });
const SummarySection = ({
  summary
}) => /* @__PURE__ */ jsxs(View, { style: styles.section, children: [
  /* @__PURE__ */ jsx(Text, { style: styles.subHeader, children: "Portfolio Summary" }),
  /* @__PURE__ */ jsxs(Text, { style: styles.metric, children: [
    "Total Value: ",
    formatPricePDF(summary.totalValue)
  ] }),
  /* @__PURE__ */ jsxs(Text, { style: styles.metric, children: [
    "Total Gain/Loss: ",
    formatPricePDF(summary.totalGainLoss)
  ] }),
  /* @__PURE__ */ jsxs(Text, { style: styles.metric, children: [
    "Overall Return: ",
    Number(summary.totalGainLossPercentage).toFixed(2),
    "%"
  ] })
] });
const HoldingsSection = ({ holdings }) => /* @__PURE__ */ jsxs(View, { style: styles.section, children: [
  /* @__PURE__ */ jsx(Text, { style: styles.subHeader, children: "Holdings Details" }),
  /* @__PURE__ */ jsxs(View, { style: styles.table, children: [
    /* @__PURE__ */ jsxs(View, { style: [styles.row, styles.header], children: [
      /* @__PURE__ */ jsx(Text, { style: [styles.headerText, styles.cell, { width: "15%" }], children: "Symbol" }),
      /* @__PURE__ */ jsx(Text, { style: [styles.headerText, styles.cell, { width: "25%" }], children: "Name" }),
      /* @__PURE__ */ jsx(Text, { style: [styles.headerText, styles.cell, { width: "15%" }], children: "Shares" }),
      /* @__PURE__ */ jsx(Text, { style: [styles.headerText, styles.cell, { width: "15%" }], children: "Avg Cost" }),
      /* @__PURE__ */ jsx(Text, { style: [styles.headerText, styles.cell, { width: "15%" }], children: "Price" }),
      /* @__PURE__ */ jsx(Text, { style: [styles.headerText, styles.cell, { width: "15%" }], children: "Value" })
    ] }),
    holdings.map((holding, index) => /* @__PURE__ */ jsxs(View, { style: [styles.row], children: [
      /* @__PURE__ */ jsx(Text, { style: [styles.cell, { width: "15%" }], children: holding.symbol }),
      /* @__PURE__ */ jsx(Text, { style: [styles.cell, { width: "25%" }], children: holding.name }),
      /* @__PURE__ */ jsx(Text, { style: [styles.cell, { width: "15%" }], children: Number(holding.shares).toFixed(4) }),
      /* @__PURE__ */ jsx(Text, { style: [styles.cell, { width: "15%" }], children: formatPricePDF(holding.averageCost) }),
      /* @__PURE__ */ jsx(Text, { style: [styles.cell, { width: "15%" }], children: formatPricePDF(holding.currentPrice) }),
      /* @__PURE__ */ jsx(Text, { style: [styles.cell, { width: "15%" }], children: formatPricePDF(holding.totalValue) })
    ] }, index))
  ] })
] });
const chartData = [
  {
    id: "SPY",
    label: "SPY",
    value: 45,
    color: "hsl(207, 70%, 50%)"
  },
  {
    id: "VOO",
    label: "VOO",
    value: 30,
    color: "hsl(180, 70%, 50%)"
  },
  {
    id: "QQQ",
    label: "QQQ",
    value: 25,
    color: "hsl(54, 70%, 50%)"
  }
];
const ChartSection = () => /* @__PURE__ */ jsx(ReactPDFChart, { style: { width: "400px", height: "400px" }, children: /* @__PURE__ */ jsx(
  _$2,
  {
    data: chartData,
    margin: { top: 40, right: 80, bottom: 80, left: 80 },
    innerRadius: 0.5,
    padAngle: 0.7,
    cornerRadius: 3,
    activeOuterRadiusOffset: 8,
    borderWidth: 1,
    borderColor: {
      from: "color",
      modifiers: [["darker", 0.2]]
    },
    arcLinkLabelsSkipAngle: 10,
    arcLinkLabelsTextColor: "#333333",
    arcLinkLabelsThickness: 2,
    arcLinkLabelsColor: { from: "color" },
    arcLabelsSkipAngle: 10,
    arcLabelsTextColor: {
      from: "color",
      modifiers: [["darker", 2]]
    },
    legends: [
      {
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 56,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "#999",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: "circle"
      }
    ]
  }
) });
const FooterSection = () => /* @__PURE__ */ jsxs(View, { style: styles.section, children: [
  /* @__PURE__ */ jsx(View, { style: { alignItems: "center" }, children: /* @__PURE__ */ jsx(Svg, { width: "1000", height: "2", style: styles.footerLine, children: /* @__PURE__ */ jsx(
    Line,
    {
      x1: "0",
      y1: "0",
      x2: "1000",
      y2: "0",
      strokeWidth: 1,
      stroke: "rgb(0,0,0)"
    }
  ) }) }),
  /* @__PURE__ */ jsx(Text, { style: styles.footerText, children: "This document is confidential and intended solely for the use of the individual or entity to whom it is addressed. Past performance does not guarantee future results. All investment values and calculations are approximations and may not reflect real-time market conditions. For official financial advice, please consult with a qualified financial advisor." })
] });
const PortfolioReport = ({ data }) => {
  return /* @__PURE__ */ jsx(Document, { children: /* @__PURE__ */ jsxs(Page, { size: "LETTER", children: [
    /* @__PURE__ */ jsx(HeaderSection, { userName: data.userName, date: data.reportDate }),
    /* @__PURE__ */ jsx(SummarySection, { summary: data.portfolioSummary }),
    /* @__PURE__ */ jsx(HoldingsSection, { holdings: data.holdings }),
    /* @__PURE__ */ jsx(ChartSection, {}),
    /* @__PURE__ */ jsx(FooterSection, {})
  ] }) });
};
const loader$5 = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }
  const [holdings, summary] = await Promise.all([
    getPortfolioHoldings(userId),
    getPortfolioSummary(userId)
  ]);
  return json({ holdings, summary, userId });
};
function Portfolio() {
  const chartData2 = [
    {
      id: "stylus",
      label: "stylus",
      value: 32,
      color: "hsl(278, 70%, 50%)"
    },
    {
      id: "make",
      label: "make",
      value: 546,
      color: "hsl(169, 70%, 50%)"
    },
    {
      id: "hack",
      label: "hack",
      value: 347,
      color: "hsl(170, 70%, 50%)"
    },
    {
      id: "python",
      label: "python",
      value: 86,
      color: "hsl(33, 70%, 50%)"
    },
    {
      id: "css",
      label: "css",
      value: 143,
      color: "hsl(81, 70%, 50%)"
    }
  ];
  const { holdings, summary, userId } = useLoaderData();
  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`/api/report/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }
      const reportData = await response.json();
      const doc = /* @__PURE__ */ jsx(PortfolioReport, { data: reportData });
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-report-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };
  if (holdings.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center h-[80vh] space-y-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-[450px]", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Welcome to Your Portfolio" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "You haven't purchased any ETF shares yet. Start building your investment portfolio today!" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsx(Link, { to: "/overview", children: "Browse ETFs" }) }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto py-6 space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Portfolio Value" }),
          /* @__PURE__ */ jsx(LineChart, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
          "$",
          formatPrice(summary.total_portfolio_value)
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Gain/Loss" }),
          summary.total_gain_loss >= 0 ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-4 w-4 text-red-500" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `text-2xl font-bold ${summary.total_gain_loss >= 0 ? "text-green-500" : "text-red-500"}`,
              children: [
                "$",
                formatPrice(summary.total_gain_loss)
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "p",
            {
              className: `text-xs ${summary.total_gain_loss_percentage >= 0 ? "text-green-500" : "text-red-500"}`,
              children: [
                Number(summary.total_gain_loss_percentage).toFixed(2),
                "%"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Holdings" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: holdings.length }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Different ETFs" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Your Holdings" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "A detailed view of your ETF investments" })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleDownloadReport,
            variant: "outline",
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(FileDown, { className: "h-4 w-4" }),
              "Download Report"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Symbol" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Shares" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Avg Cost" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Current Price" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Total Value" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Gain/Loss" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Return" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: holdings.map((holding) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsx(
            Link,
            {
              to: `/etf?ticker=${holding.ticker}`,
              className: "hover:underline",
              children: holding.ticker
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: holding.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: Number(holding.total_shares).toFixed(4) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: formatPrice(holding.average_cost) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: formatPrice(holding.current_price) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right", children: [
            "$",
            formatPrice(holding.total_value)
          ] }),
          /* @__PURE__ */ jsxs(
            TableCell,
            {
              className: `text-right ${holding.total_gain_loss >= 0 ? "text-green-500" : "text-red-500"}`,
              children: [
                "$",
                formatPrice(holding.total_gain_loss)
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            TableCell,
            {
              className: `text-right ${Number(holding.gain_loss_percentage) >= 0 ? "text-green-500" : "text-red-500"}`,
              children: [
                Number(holding.gain_loss_percentage).toFixed(2),
                "%"
              ]
            }
          )
        ] }, holding.ticker)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-[300px] w-[300px]", children: /* @__PURE__ */ jsx(
      _$2,
      {
        data: chartData2,
        margin: { top: 40, right: 80, bottom: 80, left: 80 },
        innerRadius: 0.5,
        padAngle: 0.7,
        cornerRadius: 3,
        activeOuterRadiusOffset: 8,
        borderWidth: 1,
        borderColor: {
          from: "color",
          modifiers: [["darker", 0.2]]
        },
        arcLinkLabelsSkipAngle: 10,
        arcLinkLabelsTextColor: "#333333",
        arcLinkLabelsThickness: 2,
        arcLinkLabelsColor: { from: "color" },
        arcLabelsSkipAngle: 10,
        arcLabelsTextColor: {
          from: "color",
          modifiers: [["darker", 2]]
        },
        defs: [
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ],
        fill: [
          {
            match: {
              id: "ruby"
            },
            id: "dots"
          },
          {
            match: {
              id: "c"
            },
            id: "dots"
          },
          {
            match: {
              id: "go"
            },
            id: "dots"
          },
          {
            match: {
              id: "python"
            },
            id: "dots"
          },
          {
            match: {
              id: "scala"
            },
            id: "lines"
          },
          {
            match: {
              id: "lisp"
            },
            id: "lines"
          },
          {
            match: {
              id: "elixir"
            },
            id: "lines"
          },
          {
            match: {
              id: "javascript"
            },
            id: "lines"
          }
        ],
        legends: [
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000"
                }
              }
            ]
          }
        ]
      }
    ) })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Portfolio,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
function SignInPage() {
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx(SignIn, {}) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SignInPage
}, Symbol.toStringTag, { value: "Module" }));
function SignUpPage() {
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx(SignUp, {}) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SignUpPage
}, Symbol.toStringTag, { value: "Module" }));
const TIMEFRAMES = {
  "1D": {
    multiplier: 5,
    timespan: "minute",
    fromDate: (date2) => {
      const adjustedDate = adjustForWeekend(date2);
      const yesterday = new Date(adjustedDate);
      yesterday.setDate(yesterday.getDate() - 1);
      return formatDate(yesterday);
    },
    toDate: (date2) => formatDate(date2)
  },
  "1W": {
    multiplier: 1,
    timespan: "hour",
    fromDate: (date2) => {
      const weekAgo = new Date(date2);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return formatDate(weekAgo);
    },
    toDate: (date2) => formatDate(date2)
  },
  "1M": {
    multiplier: 6,
    timespan: "hour",
    fromDate: (date2) => {
      const monthAgo = new Date(date2);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return formatDate(monthAgo);
    },
    toDate: (date2) => formatDate(date2)
  },
  // Disabled due to API limitations
  // "3M": {
  //   multiplier: 1,
  //   timespan: "day",
  //   fromDate: (date: Date) => {
  //     const threeMonthsAgo = new Date(date);
  //     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  //     return formatDate(threeMonthsAgo);
  //   },
  //   toDate: (date: Date) => formatDate(date),
  // },
  YTD: {
    multiplier: 1,
    timespan: "day",
    fromDate: (date2) => `${date2.getFullYear()}-01-01`,
    toDate: (date2) => formatDate(date2)
  },
  "1Y": {
    multiplier: 1,
    timespan: "day",
    fromDate: (date2) => {
      const yearAgo = new Date(date2);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return formatDate(yearAgo);
    },
    toDate: (date2) => formatDate(date2)
  }
  // Disabled due to API limitations
  // "2Y": {
  //   multiplier: 1,
  //   timespan: "week",
  //   fromDate: (date: Date) => {
  //     const fiveYearsAgo = new Date(date);
  //     fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 2);
  //     return formatDate(fiveYearsAgo);
  //   },
  //   toDate: (date: Date) => formatDate(date),
  // },
};
function formatDate(date2) {
  return date2.toISOString().split("T")[0];
}
function adjustForWeekend(date2) {
  const estDate = new Date(
    date2.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const day2 = estDate.getDay();
  const hours = estDate.getHours();
  const minutes = estDate.getMinutes();
  if (day2 === 1 && (hours < 9 || hours === 9 && minutes < 30)) {
    estDate.setDate(estDate.getDate() - 2);
  } else if (day2 === 0) {
    estDate.setDate(estDate.getDate() - 2);
  } else if (day2 === 6) {
    estDate.setDate(estDate.getDate() - 1);
  }
  return estDate;
}
function getTimeframeConfig(timeframe) {
  const config2 = TIMEFRAMES[timeframe];
  const currentDate = /* @__PURE__ */ new Date();
  return {
    multiplier: config2.multiplier,
    timespan: config2.timespan,
    fromDate: config2.fromDate(currentDate),
    toDate: config2.toDate(currentDate)
  };
}
async function fetchChartData(ticker2, apiKey, timeframe = "1D") {
  const config2 = getTimeframeConfig(timeframe);
  const url = new URL(
    `https://api.polygon.io/v2/aggs/ticker/${ticker2}/range/${config2.multiplier}/${config2.timespan}/${config2.fromDate}/${config2.toDate}`
  );
  url.searchParams.append("adjusted", "false");
  url.searchParams.append("sort", "asc");
  url.searchParams.append("apiKey", apiKey);
  if (timeframe === "1M") {
    url.searchParams.append("limit", "50000");
  }
  const response = await fetch(url.toString());
  return response.json();
}
async function getETFByTicker(ticker2) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT etf_cache_price.*, etf_info.name 
      FROM etf_cache_price 
      INNER JOIN etf_info on etf_cache_price.ticker = etf_info.ticker 
      WHERE etf_cache_price.ticker = $1`,
      [ticker2]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
async function getCachedETFData(ticker2, timeframe = "1W") {
  var _a;
  const client = await pool.connect();
  try {
    const priceResult = await client.query(
      `SELECT etf_cache_price.*, etf_info.name 
      FROM etf_cache_price 
      INNER JOIN etf_info on etf_cache_price.ticker = etf_info.ticker 
      WHERE etf_cache_price.ticker = $1`,
      [ticker2]
    );
    const chartResult = await client.query(
      `SELECT chart_data 
      FROM etf_cache_chart 
      WHERE ticker = $1 AND timeframe = $2`,
      [ticker2, timeframe]
    );
    if (priceResult.rows[0]) {
      console.log(`Data for ${ticker2} retrieved from cache: ${timeframe}`);
    } else {
      console.log(`No cached data found for ${ticker2}`);
    }
    return {
      ...priceResult.rows[0],
      chart_data: ((_a = chartResult.rows[0]) == null ? void 0 : _a.chart_data) || null
    };
  } finally {
    client.release();
  }
}
function getStalenessThreshold(timeframe) {
  const config2 = TIMEFRAMES[timeframe];
  switch (config2.timespan) {
    case "minute":
      return config2.multiplier * 60 * 1e3;
    case "hour":
      return config2.multiplier * 60 * 60 * 1e3;
    case "day":
      return config2.multiplier * 24 * 60 * 60 * 1e3;
    default:
      return 5 * 60 * 1e3;
  }
}
async function isCacheStale(ticker2, timeframe = "1W") {
  const client = await pool.connect();
  try {
    const priceResult = await client.query(
      "SELECT last_updated FROM etf_cache_price WHERE ticker = $1",
      [ticker2]
    );
    const chartResult = await client.query(
      "SELECT last_updated FROM etf_cache_chart WHERE ticker = $1 AND timeframe = $2",
      [ticker2, timeframe]
    );
    if (priceResult.rows.length === 0 || chartResult.rows.length === 0)
      return true;
    const priceLastUpdated = new Date(priceResult.rows[0].last_updated);
    const chartLastUpdated = new Date(chartResult.rows[0].last_updated);
    const threshold = getStalenessThreshold(timeframe);
    const thresholdDate = new Date(Date.now() - threshold);
    return priceLastUpdated < thresholdDate || chartLastUpdated < thresholdDate;
  } finally {
    client.release();
  }
}
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn$4(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn$4("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn$4(error && "text-red-500 dark:text-red-900", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn$4("text-[0.8rem] text-neutral-500 dark:text-neutral-400", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error == null ? void 0 : error.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn$4("text-[0.8rem] font-medium text-red-500 dark:text-red-900", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
function v$3() {
  return v$3 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var o2 = arguments[i2];
      for (var n2 in o2) Object.prototype.hasOwnProperty.call(o2, n2) && (t2[n2] = o2[n2]);
    }
    return t2;
  }, v$3.apply(this, arguments);
}
var x$3 = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 }, m$3 = function(t2, i2) {
  return "translate(" + t2 + "px, " + i2 + "px)";
}, b$4 = memo(function(t2) {
  var o2, n2 = t2.position, r2 = t2.anchor, e3 = t2.children, l2 = zt(), d = Ur(), y2 = d.animate, f2 = d.config, b2 = kt(), g2 = b2[0], w2 = b2[1], T2 = useRef(false), C2 = void 0, E2 = false, P2 = w2.width > 0 && w2.height > 0, j2 = Math.round(n2[0]), N2 = Math.round(n2[1]);
  P2 && ("top" === r2 ? (j2 -= w2.width / 2, N2 -= w2.height + 14) : "right" === r2 ? (j2 += 14, N2 -= w2.height / 2) : "bottom" === r2 ? (j2 -= w2.width / 2, N2 += 14) : "left" === r2 ? (j2 -= w2.width + 14, N2 -= w2.height / 2) : "center" === r2 && (j2 -= w2.width / 2, N2 -= w2.height / 2), C2 = { transform: m$3(j2, N2) }, T2.current || (E2 = true), T2.current = [j2, N2]);
  var O2 = useSpring({ to: C2, config: f2, immediate: !y2 || E2 }), V2 = v$3({}, x$3, l2.tooltip.wrapper, { transform: null != (o2 = O2.transform) ? o2 : m$3(j2, N2), opacity: O2.transform ? 1 : 0 });
  return jsx(animated.div, { ref: g2, style: V2, children: e3 });
});
b$4.displayName = "TooltipWrapper";
var g$2 = memo(function(t2) {
  var i2 = t2.size, o2 = void 0 === i2 ? 12 : i2, n2 = t2.color, r2 = t2.style;
  return jsx("span", { style: v$3({ display: "block", width: o2, height: o2, background: n2 }, void 0 === r2 ? {} : r2) });
});
memo(function(t2) {
  var i2, o2 = t2.id, n2 = t2.value, r2 = t2.format, e3 = t2.enableChip, l2 = void 0 !== e3 && e3, a2 = t2.color, c2 = t2.renderContent, h = zt(), u2 = Ot(r2);
  if ("function" == typeof c2) i2 = c2();
  else {
    var f2 = n2;
    void 0 !== u2 && void 0 !== f2 && (f2 = u2(f2)), i2 = jsxs("div", { style: h.tooltip.basic, children: [l2 && jsx(g$2, { color: a2, style: h.tooltip.chip }), void 0 !== f2 ? jsxs("span", { children: [o2, ": ", jsx("strong", { children: "" + f2 })] }) : o2] });
  }
  return jsx("div", { style: h.tooltip.container, children: i2 });
});
var T$4 = { width: "100%", borderCollapse: "collapse" }, C$4 = memo(function(t2) {
  var i2, o2 = t2.title, n2 = t2.rows, r2 = void 0 === n2 ? [] : n2, e3 = t2.renderContent, l2 = zt();
  return r2.length ? (i2 = "function" == typeof e3 ? e3() : jsxs("div", { children: [o2 && o2, jsx("table", { style: v$3({}, T$4, l2.tooltip.table), children: jsx("tbody", { children: r2.map(function(t3, i3) {
    return jsx("tr", { children: t3.map(function(t4, i4) {
      return jsx("td", { style: l2.tooltip.tableCell, children: t4 }, i4);
    }) }, i3);
  }) }) })] }), jsx("div", { style: l2.tooltip.container, children: i2 })) : null;
});
C$4.displayName = "TableTooltip";
var E$3 = memo(function(t2) {
  var i2 = t2.x0, n2 = t2.x1, r2 = t2.y0, e3 = t2.y1, l2 = zt(), u2 = Ur(), d = u2.animate, y2 = u2.config, f2 = useMemo(function() {
    return v$3({}, l2.crosshair.line, { pointerEvents: "none" });
  }, [l2.crosshair.line]), x2 = useSpring({ x1: i2, x2: n2, y1: r2, y2: e3, config: y2, immediate: !d });
  return jsx(animated.line, v$3({}, x2, { fill: "none", style: f2 }));
});
E$3.displayName = "CrosshairLine";
var P$4 = memo(function(t2) {
  var i2, o2, n2 = t2.width, r2 = t2.height, e3 = t2.type, l2 = t2.x, a2 = t2.y;
  return "cross" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: r2 }, o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }) : "top-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "top" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: a2 } : "top-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "right" === e3 ? o2 = { x0: l2, x1: n2, y0: a2, y1: a2 } : "bottom-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "bottom" === e3 ? i2 = { x0: l2, x1: l2, y0: a2, y1: r2 } : "bottom-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "left" === e3 ? o2 = { x0: 0, x1: l2, y0: a2, y1: a2 } : "x" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: r2 } : "y" === e3 && (o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }), jsxs(Fragment, { children: [i2 && jsx(E$3, { x0: i2.x0, x1: i2.x1, y0: i2.y0, y1: i2.y1 }), o2 && jsx(E$3, { x0: o2.x0, x1: o2.x1, y0: o2.y0, y1: o2.y1 })] });
});
P$4.displayName = "Crosshair";
var j$3 = createContext({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} }), N$2 = { isVisible: false, position: [null, null], content: null, anchor: null }, O$2 = createContext(N$2), V = function(t2) {
  var i2 = useState(N$2), n2 = i2[0], l2 = i2[1], a2 = useCallback(function(t3, i3, o2) {
    var n3 = i3[0], r2 = i3[1];
    void 0 === o2 && (o2 = "top"), l2({ isVisible: true, position: [n3, r2], anchor: o2, content: t3 });
  }, [l2]), c2 = useCallback(function(i3, o2, n3) {
    void 0 === n3 && (n3 = "top");
    var r2 = t2.current.getBoundingClientRect(), e3 = t2.current.offsetWidth, a3 = e3 === r2.width ? 1 : e3 / r2.width, c3 = "touches" in o2 ? o2.touches[0] : o2, s2 = c3.clientX, h = c3.clientY, u2 = (s2 - r2.left) * a3, d = (h - r2.top) * a3;
    "left" !== n3 && "right" !== n3 || (n3 = u2 < r2.width / 2 ? "right" : "left"), l2({ isVisible: true, position: [u2, d], anchor: n3, content: i3 });
  }, [t2, l2]), s = useCallback(function() {
    l2(N$2);
  }, [l2]);
  return { actions: useMemo(function() {
    return { showTooltipAt: a2, showTooltipFromEvent: c2, hideTooltip: s };
  }, [a2, c2, s]), state: n2 };
}, z$2 = function() {
  var t2 = useContext(O$2);
  if (void 0 === t2) throw new Error("useTooltipState must be used within a TooltipProvider");
  return t2;
}, A$1 = function(t2) {
  return t2.isVisible;
}, F = function() {
  var t2 = z$2();
  return A$1(t2) ? jsx(b$4, { position: t2.position, anchor: t2.anchor, children: t2.content }) : null;
}, M = function(t2) {
  var i2 = t2.container, o2 = t2.children, n2 = V(i2), r2 = n2.actions, e3 = n2.state;
  return jsx(j$3.Provider, { value: r2, children: jsx(O$2.Provider, { value: e3, children: o2 }) });
};
var Pr = { background: "transparent", text: { fontFamily: "sans-serif", fontSize: 11, fill: "#333333", outlineWidth: 0, outlineColor: "transparent", outlineOpacity: 1 }, axis: { domain: { line: { stroke: "transparent", strokeWidth: 1 } }, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: {} }, legend: { text: { fontSize: 12 } } }, grid: { line: { stroke: "#dddddd", strokeWidth: 1 } }, legends: { hidden: { symbol: { fill: "#333333", opacity: 0.6 }, text: { fill: "#333333", opacity: 0.6 } }, text: {}, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: { fontSize: 10 } }, title: { text: {} } }, labels: { text: {} }, markers: { lineColor: "#000000", lineStrokeWidth: 1, text: {} }, dots: { text: {} }, tooltip: { container: { background: "white", color: "inherit", fontSize: "inherit", borderRadius: "2px", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)", padding: "5px 9px" }, basic: { whiteSpace: "pre", display: "flex", alignItems: "center" }, chip: { marginRight: 7 }, table: {}, tableCell: { padding: "3px 5px" }, tableCellValue: { fontWeight: "bold" } }, crosshair: { line: { stroke: "#000000", strokeWidth: 1, strokeOpacity: 0.75, strokeDasharray: "6 6" } }, annotations: { text: { fontSize: 13, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, link: { stroke: "#000000", strokeWidth: 1, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, outline: { fill: "none", stroke: "#000000", strokeWidth: 2, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, symbol: { fill: "#000000", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 } } };
function jr() {
  return jr = Object.assign ? Object.assign.bind() : function(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = arguments[r2];
      for (var n2 in t2) Object.prototype.hasOwnProperty.call(t2, n2) && (e3[n2] = t2[n2]);
    }
    return e3;
  }, jr.apply(this, arguments);
}
function Sr(e3, r2) {
  return Sr = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, r3) {
    return e4.__proto__ = r3, e4;
  }, Sr(e3, r2);
}
function Br(e3, r2) {
  if (null == e3) return {};
  var t2, n2, i2 = {}, o2 = Object.keys(e3);
  for (n2 = 0; n2 < o2.length; n2++) t2 = o2[n2], r2.indexOf(t2) >= 0 || (i2[t2] = e3[t2]);
  return i2;
}
var Gr = ["axis.ticks.text", "axis.legend.text", "legends.title.text", "legends.text", "legends.ticks.text", "legends.title.text", "labels.text", "dots.text", "markers.text", "annotations.text"], Lr = function(e3, r2) {
  return jr({}, r2, e3);
}, Ir = function(e3, r2) {
  var t2 = m$7({}, e3, r2);
  return Gr.forEach(function(e4) {
    v$8(t2, e4, Lr(y$2(t2, e4), t2.text));
  }), t2;
}, Yr = createContext(), Ar = function(e3) {
  var t2 = e3.children, n2 = e3.animate, i2 = void 0 === n2 || n2, o2 = e3.config, l2 = void 0 === o2 ? "default" : o2, a2 = useMemo(function() {
    var e4 = O$6(l2) ? config[l2] : l2;
    return { animate: i2, config: e4 };
  }, [i2, l2]);
  return jsx(Yr.Provider, { value: a2, children: t2 });
}, Er = { animate: c$3.bool, motionConfig: c$3.oneOfType([c$3.oneOf(Object.keys(config)), c$3.shape({ mass: c$3.number, tension: c$3.number, friction: c$3.number, clamp: c$3.bool, precision: c$3.number, velocity: c$3.number, duration: c$3.number, easing: c$3.func })]) };
Ar.propTypes = { children: c$3.node.isRequired, animate: Er.animate, config: Er.motionConfig };
var Ur = function() {
  return useContext(Yr);
}, Fr = function(e3) {
  var t2 = Ur(), o2 = t2.animate, l2 = t2.config, a2 = function(e4) {
    var r2 = useRef();
    return useEffect(function() {
      r2.current = e4;
    }, [e4]), r2.current;
  }(e3), d = useMemo(function() {
    return _$4(a2, e3);
  }, [a2, e3]), s = useSpring({ from: { value: 0 }, to: { value: 1 }, reset: true, config: l2, immediate: !o2 }).value;
  return to(s, d);
}, Xr = { nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"], BrBG: W$5(scheme$q), PRGn: W$5(scheme$p), PiYG: W$5(scheme$o), PuOr: W$5(scheme$n), RdBu: W$5(scheme$m), RdGy: W$5(scheme$l), RdYlBu: W$5(scheme$k), RdYlGn: W$5(scheme$j), spectral: W$5(scheme$i), blues: W$5(scheme$5), greens: W$5(scheme$4), greys: W$5(scheme$3), oranges: W$5(scheme), purples: W$5(scheme$2), reds: W$5(scheme$1), BuGn: W$5(scheme$h), BuPu: W$5(scheme$g), GnBu: W$5(scheme$f), OrRd: W$5(scheme$e), PuBuGn: W$5(scheme$d), PuBu: W$5(scheme$c), PuRd: W$5(scheme$b), RdPu: W$5(scheme$a), YlGnBu: W$5(scheme$9), YlGn: W$5(scheme$8), YlOrBr: W$5(scheme$7), YlOrRd: W$5(scheme$6) }, Nr = Object.keys(Xr);
({ nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: e, accent: r, dark2: n, paired: t, pastel1: o, pastel2: i, set1: u$2, set2: a, set3: l, brown_blueGreen: W$5(scheme$q), purpleRed_green: W$5(scheme$p), pink_yellowGreen: W$5(scheme$o), purple_orange: W$5(scheme$n), red_blue: W$5(scheme$m), red_grey: W$5(scheme$l), red_yellow_blue: W$5(scheme$k), red_yellow_green: W$5(scheme$j), spectral: W$5(scheme$i), blues: W$5(scheme$5), greens: W$5(scheme$4), greys: W$5(scheme$3), oranges: W$5(scheme), purples: W$5(scheme$2), reds: W$5(scheme$1), blue_green: W$5(scheme$h), blue_purple: W$5(scheme$g), green_blue: W$5(scheme$f), orange_red: W$5(scheme$e), purple_blue_green: W$5(scheme$d), purple_blue: W$5(scheme$c), purple_red: W$5(scheme$b), red_purple: W$5(scheme$a), yellow_green_blue: W$5(scheme$9), yellow_green: W$5(scheme$8), yellow_orange_brown: W$5(scheme$7), yellow_orange_red: W$5(scheme$6) });
c$3.oneOfType([c$3.oneOf(Nr), c$3.func, c$3.arrayOf(c$3.string)]);
var rt = { basis: $e$3, basisClosed: er, basisOpen: rr, bundle: tr, cardinal: nr, cardinalClosed: ir, cardinalOpen: or, catmullRom: lr, catmullRomClosed: ar, catmullRomOpen: dr, linear: sr, linearClosed: ur, monotoneX, monotoneY, natural: pr$2, step: hr, stepAfter, stepBefore }, tt = Object.keys(rt);
tt.filter(function(e3) {
  return e3.endsWith("Closed");
});
Ze(tt, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
Ze(tt, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
var lt = function(e3) {
  if (!rt[e3]) throw new TypeError("'" + e3 + "', is not a valid curve interpolator identifier.");
  return rt[e3];
};
c$3.shape({ top: c$3.number, right: c$3.number, bottom: c$3.number, left: c$3.number }).isRequired;
var ht = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
c$3.oneOf(ht);
ordinal(l);
var _t = { top: 0, right: 0, bottom: 0, left: 0 }, wt = function(e3, t2, n2) {
  return void 0 === n2 && (n2 = {}), useMemo(function() {
    var r2 = jr({}, _t, n2);
    return { margin: r2, innerWidth: e3 - r2.left - r2.right, innerHeight: t2 - r2.top - r2.bottom, outerWidth: e3, outerHeight: t2 };
  }, [e3, t2, n2.top, n2.right, n2.bottom, n2.left]);
}, kt = function() {
  var e3 = useRef(null), r2 = useState({ left: 0, top: 0, width: 0, height: 0 }), t2 = r2[0], l2 = r2[1], a2 = useState(function() {
    return "undefined" == typeof ResizeObserver ? null : new ResizeObserver(function(e4) {
      var r3 = e4[0];
      return l2(r3.contentRect);
    });
  })[0];
  return useEffect(function() {
    return e3.current && null !== a2 && a2.observe(e3.current), function() {
      null !== a2 && a2.disconnect();
    };
  }, []), [e3, t2];
}, Rt = function(e3) {
  return useMemo(function() {
    return Ir(Pr, e3);
  }, [e3]);
}, xt = function(e3) {
  return "function" == typeof e3 ? e3 : "string" == typeof e3 ? 0 === e3.indexOf("time:") ? timeFormat(e3.slice("5")) : format(e3) : function(e4) {
    return "" + e4;
  };
}, Ot = function(e3) {
  return useMemo(function() {
    return xt(e3);
  }, [e3]);
}, qt = createContext(), Ct = {}, Wt = function(e3) {
  var r2 = e3.theme, t2 = void 0 === r2 ? Ct : r2, n2 = e3.children, i2 = Rt(t2);
  return jsx(qt.Provider, { value: i2, children: n2 });
};
Wt.propTypes = { children: c$3.node.isRequired, theme: c$3.object };
var zt = function() {
  return useContext(qt);
}, Tt = ["outlineWidth", "outlineColor", "outlineOpacity"], Mt = function(e3) {
  return e3.outlineWidth, e3.outlineColor, e3.outlineOpacity, Br(e3, Tt);
}, Pt = function(e3) {
  var r2 = e3.children, t2 = e3.condition, n2 = e3.wrapper;
  return t2 ? cloneElement(n2, {}, r2) : r2;
};
Pt.propTypes = { children: c$3.node.isRequired, condition: c$3.bool.isRequired, wrapper: c$3.element.isRequired };
var jt = { position: "relative" }, St = function(e3) {
  var r2 = e3.children, t2 = e3.theme, i2 = e3.renderWrapper, o2 = void 0 === i2 || i2, l2 = e3.isInteractive, a2 = void 0 === l2 || l2, d = e3.animate, s = e3.motionConfig, u2 = useRef(null);
  return jsx(Wt, { theme: t2, children: jsx(Ar, { animate: d, config: s, children: jsx(M, { container: u2, children: jsxs(Pt, { condition: o2, wrapper: jsx("div", { style: jt, ref: u2 }), children: [r2, a2 && jsx(F, {})] }) }) }) });
};
St.propTypes = { children: c$3.element.isRequired, isInteractive: c$3.bool, renderWrapper: c$3.bool, theme: c$3.object, animate: c$3.bool, motionConfig: c$3.oneOfType([c$3.string, Er.motionConfig]) };
({ children: c$3.func.isRequired, isInteractive: c$3.bool, renderWrapper: c$3.bool, theme: c$3.object.isRequired, animate: c$3.bool.isRequired, motionConfig: c$3.oneOfType([c$3.string, Er.motionConfig]) });
var It = function(e3) {
  var r2 = e3.children, t2 = kt(), n2 = t2[0], i2 = t2[1], o2 = i2.width > 0 && i2.height > 0;
  return jsx("div", { ref: n2, style: { width: "100%", height: "100%" }, children: o2 && r2({ width: i2.width, height: i2.height }) });
};
It.propTypes = { children: c$3.func.isRequired };
var Yt = ["id", "colors"], Dt = function(e3) {
  var r2 = e3.id, t2 = e3.colors, n2 = Br(e3, Yt);
  return jsx("linearGradient", jr({ id: r2, x1: 0, x2: 0, y1: 0, y2: 1 }, n2, { children: t2.map(function(e4) {
    var r3 = e4.offset, t3 = e4.color, n3 = e4.opacity;
    return jsx("stop", { offset: r3 + "%", stopColor: t3, stopOpacity: void 0 !== n3 ? n3 : 1 }, r3);
  }) }));
};
Dt.propTypes = { id: c$3.string.isRequired, colors: c$3.arrayOf(c$3.shape({ offset: c$3.number.isRequired, color: c$3.string.isRequired, opacity: c$3.number })).isRequired, gradientTransform: c$3.string };
var Et = { linearGradient: Dt }, Ut = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false }, Ft = memo(function(e3) {
  var r2 = e3.id, t2 = e3.background, n2 = void 0 === t2 ? Ut.background : t2, i2 = e3.color, o2 = void 0 === i2 ? Ut.color : i2, l2 = e3.size, a2 = void 0 === l2 ? Ut.size : l2, d = e3.padding, s = void 0 === d ? Ut.padding : d, u2 = e3.stagger, c2 = void 0 === u2 ? Ut.stagger : u2, f2 = a2 + s, p2 = a2 / 2, h = s / 2;
  return true === c2 && (f2 = 2 * a2 + 2 * s), jsxs("pattern", { id: r2, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: f2, height: f2, fill: n2 }), jsx("circle", { cx: h + p2, cy: h + p2, r: p2, fill: o2 }), c2 && jsx("circle", { cx: 1.5 * s + a2 + p2, cy: 1.5 * s + a2 + p2, r: p2, fill: o2 })] });
});
Ft.displayName = "PatternDots", Ft.propTypes = { id: c$3.string.isRequired, color: c$3.string.isRequired, background: c$3.string.isRequired, size: c$3.number.isRequired, padding: c$3.number.isRequired, stagger: c$3.bool.isRequired };
var Ht = function(e3) {
  return e3 * Math.PI / 180;
}, rn$1 = { svg: { align: { left: "start", center: "middle", right: "end", start: "start", middle: "middle", end: "end" }, baseline: { top: "text-before-edge", center: "central", bottom: "alphabetic" } }, canvas: { align: { left: "left", center: "center", right: "right", start: "left", middle: "center", end: "right" }, baseline: { top: "top", center: "middle", bottom: "bottom" } } }, nn$1 = { spacing: 5, rotation: 0, background: "#000000", color: "#ffffff", lineWidth: 2 }, on$1 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.spacing, n2 = void 0 === t2 ? nn$1.spacing : t2, i2 = e3.rotation, o2 = void 0 === i2 ? nn$1.rotation : i2, l2 = e3.background, a2 = void 0 === l2 ? nn$1.background : l2, d = e3.color, s = void 0 === d ? nn$1.color : d, u2 = e3.lineWidth, c2 = void 0 === u2 ? nn$1.lineWidth : u2, f2 = Math.round(o2) % 360, p2 = Math.abs(n2);
  f2 > 180 ? f2 -= 360 : f2 > 90 ? f2 -= 180 : f2 < -180 ? f2 += 360 : f2 < -90 && (f2 += 180);
  var h, g2 = p2, b2 = p2;
  return 0 === f2 ? h = "\n                M 0 0 L " + g2 + " 0\n                M 0 " + b2 + " L " + g2 + " " + b2 + "\n            " : 90 === f2 ? h = "\n                M 0 0 L 0 " + b2 + "\n                M " + g2 + " 0 L " + g2 + " " + b2 + "\n            " : (g2 = Math.abs(p2 / Math.sin(Ht(f2))), b2 = p2 / Math.sin(Ht(90 - f2)), h = f2 > 0 ? "\n                    M 0 " + -b2 + " L " + 2 * g2 + " " + b2 + "\n                    M " + -g2 + " " + -b2 + " L " + g2 + " " + b2 + "\n                    M " + -g2 + " 0 L " + g2 + " " + 2 * b2 + "\n                " : "\n                    M " + -g2 + " " + b2 + " L " + g2 + " " + -b2 + "\n                    M " + -g2 + " " + 2 * b2 + " L " + 2 * g2 + " " + -b2 + "\n                    M 0 " + 2 * b2 + " L " + 2 * g2 + " 0\n                "), jsxs("pattern", { id: r2, width: g2, height: b2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: g2, height: b2, fill: a2, stroke: "rgba(255, 0, 0, 0.1)", strokeWidth: 0 }), jsx("path", { d: h, strokeWidth: c2, stroke: s, strokeLinecap: "square" })] });
});
on$1.displayName = "PatternLines", on$1.propTypes = { id: c$3.string.isRequired, spacing: c$3.number.isRequired, rotation: c$3.number.isRequired, background: c$3.string.isRequired, color: c$3.string.isRequired, lineWidth: c$3.number.isRequired };
var an$1 = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false }, dn$1 = memo(function(e3) {
  var r2 = e3.id, t2 = e3.color, n2 = void 0 === t2 ? an$1.color : t2, i2 = e3.background, o2 = void 0 === i2 ? an$1.background : i2, l2 = e3.size, a2 = void 0 === l2 ? an$1.size : l2, d = e3.padding, s = void 0 === d ? an$1.padding : d, u2 = e3.stagger, c2 = void 0 === u2 ? an$1.stagger : u2, f2 = a2 + s, p2 = s / 2;
  return true === c2 && (f2 = 2 * a2 + 2 * s), jsxs("pattern", { id: r2, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [jsx("rect", { width: f2, height: f2, fill: o2 }), jsx("rect", { x: p2, y: p2, width: a2, height: a2, fill: n2 }), c2 && jsx("rect", { x: 1.5 * s + a2, y: 1.5 * s + a2, width: a2, height: a2, fill: n2 })] });
});
dn$1.displayName = "PatternSquares", dn$1.propTypes = { id: c$3.string.isRequired, color: c$3.string.isRequired, background: c$3.string.isRequired, size: c$3.number.isRequired, padding: c$3.number.isRequired, stagger: c$3.bool.isRequired };
var un$1 = { patternDots: Ft, patternLines: on$1, patternSquares: dn$1 }, cn$1 = ["type"], fn$1 = jr({}, Et, un$1), pn$1 = function(e3) {
  var r2 = e3.defs;
  return !r2 || r2.length < 1 ? null : jsx("defs", { "aria-hidden": true, children: r2.map(function(e4) {
    var r3 = e4.type, t2 = Br(e4, cn$1);
    return fn$1[r3] ? createElement(fn$1[r3], jr({ key: t2.id }, t2)) : null;
  }) });
};
pn$1.propTypes = { defs: c$3.arrayOf(c$3.shape({ type: c$3.oneOf(Object.keys(fn$1)).isRequired, id: c$3.string.isRequired })) };
var hn$1 = memo(pn$1), gn$1 = function(e3) {
  var r2 = e3.width, t2 = e3.height, n2 = e3.margin, i2 = e3.defs, o2 = e3.children, l2 = e3.role, a2 = e3.ariaLabel, d = e3.ariaLabelledBy, s = e3.ariaDescribedBy, u2 = e3.isFocusable, c2 = zt();
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: r2, height: t2, role: l2, "aria-label": a2, "aria-labelledby": d, "aria-describedby": s, focusable: u2, tabIndex: u2 ? 0 : void 0, children: [jsx(hn$1, { defs: i2 }), jsx("rect", { width: r2, height: t2, fill: c2.background }), jsx("g", { transform: "translate(" + n2.left + "," + n2.top + ")", children: o2 })] });
};
gn$1.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, margin: c$3.shape({ top: c$3.number.isRequired, left: c$3.number.isRequired }).isRequired, defs: c$3.array, children: c$3.oneOfType([c$3.arrayOf(c$3.node), c$3.node]).isRequired, role: c$3.string, isFocusable: c$3.bool, ariaLabel: c$3.string, ariaLabelledBy: c$3.string, ariaDescribedBy: c$3.string };
var bn = function(e3) {
  var r2 = e3.size, t2 = e3.color, n2 = e3.borderWidth, i2 = e3.borderColor;
  return jsx("circle", { r: r2 / 2, fill: t2, stroke: i2, strokeWidth: n2, style: { pointerEvents: "none" } });
};
bn.propTypes = { size: c$3.number.isRequired, color: c$3.string.isRequired, borderWidth: c$3.number.isRequired, borderColor: c$3.string.isRequired };
var mn$1 = memo(bn), yn$1 = function(e3) {
  var r2 = e3.x, t2 = e3.y, n2 = e3.symbol, i2 = void 0 === n2 ? mn$1 : n2, o2 = e3.size, l2 = e3.datum, a2 = e3.color, d = e3.borderWidth, u2 = e3.borderColor, c2 = e3.label, f2 = e3.labelTextAnchor, p2 = void 0 === f2 ? "middle" : f2, h = e3.labelYOffset, g2 = void 0 === h ? -12 : h, b2 = zt(), m2 = Ur(), y2 = m2.animate, v2 = m2.config, _2 = useSpring({ transform: "translate(" + r2 + ", " + t2 + ")", config: v2, immediate: !y2 });
  return jsxs(animated.g, { transform: _2.transform, style: { pointerEvents: "none" }, children: [createElement(i2, { size: o2, color: a2, datum: l2, borderWidth: d, borderColor: u2 }), c2 && jsx("text", { textAnchor: p2, y: g2, style: Mt(b2.dots.text), children: c2 })] });
};
yn$1.propTypes = { x: c$3.number.isRequired, y: c$3.number.isRequired, datum: c$3.object.isRequired, size: c$3.number.isRequired, color: c$3.string.isRequired, borderWidth: c$3.number.isRequired, borderColor: c$3.string.isRequired, symbol: c$3.oneOfType([c$3.func, c$3.object]), label: c$3.oneOfType([c$3.string, c$3.number]), labelTextAnchor: c$3.oneOf(["start", "middle", "end"]), labelYOffset: c$3.number };
var vn$1 = memo(yn$1), _n = function(e3) {
  var r2 = e3.width, t2 = e3.height, n2 = e3.axis, i2 = e3.scale, o2 = e3.value, l2 = e3.lineStyle, a2 = e3.textStyle, d = e3.legend, s = e3.legendNode, u2 = e3.legendPosition, c2 = void 0 === u2 ? "top-right" : u2, f2 = e3.legendOffsetX, p2 = void 0 === f2 ? 14 : f2, h = e3.legendOffsetY, g2 = void 0 === h ? 14 : h, b2 = e3.legendOrientation, m2 = void 0 === b2 ? "horizontal" : b2, y2 = zt(), v2 = 0, _2 = 0, w2 = 0, k2 = 0;
  if ("y" === n2 ? (w2 = i2(o2), _2 = r2) : (v2 = i2(o2), k2 = t2), d && !s) {
    var R = function(e4) {
      var r3 = e4.axis, t3 = e4.width, n3 = e4.height, i3 = e4.position, o3 = e4.offsetX, l3 = e4.offsetY, a3 = e4.orientation, d2 = 0, s2 = 0, u3 = "vertical" === a3 ? -90 : 0, c3 = "start";
      if ("x" === r3) switch (i3) {
        case "top-left":
          d2 = -o3, s2 = l3, c3 = "end";
          break;
        case "top":
          s2 = -l3, c3 = "horizontal" === a3 ? "middle" : "start";
          break;
        case "top-right":
          d2 = o3, s2 = l3, c3 = "horizontal" === a3 ? "start" : "end";
          break;
        case "right":
          d2 = o3, s2 = n3 / 2, c3 = "horizontal" === a3 ? "start" : "middle";
          break;
        case "bottom-right":
          d2 = o3, s2 = n3 - l3, c3 = "start";
          break;
        case "bottom":
          s2 = n3 + l3, c3 = "horizontal" === a3 ? "middle" : "end";
          break;
        case "bottom-left":
          s2 = n3 - l3, d2 = -o3, c3 = "horizontal" === a3 ? "end" : "start";
          break;
        case "left":
          d2 = -o3, s2 = n3 / 2, c3 = "horizontal" === a3 ? "end" : "middle";
      }
      else switch (i3) {
        case "top-left":
          d2 = o3, s2 = -l3, c3 = "start";
          break;
        case "top":
          d2 = t3 / 2, s2 = -l3, c3 = "horizontal" === a3 ? "middle" : "start";
          break;
        case "top-right":
          d2 = t3 - o3, s2 = -l3, c3 = "horizontal" === a3 ? "end" : "start";
          break;
        case "right":
          d2 = t3 + o3, c3 = "horizontal" === a3 ? "start" : "middle";
          break;
        case "bottom-right":
          d2 = t3 - o3, s2 = l3, c3 = "end";
          break;
        case "bottom":
          d2 = t3 / 2, s2 = l3, c3 = "horizontal" === a3 ? "middle" : "end";
          break;
        case "bottom-left":
          d2 = o3, s2 = l3, c3 = "horizontal" === a3 ? "start" : "end";
          break;
        case "left":
          d2 = -o3, c3 = "horizontal" === a3 ? "end" : "middle";
      }
      return { x: d2, y: s2, rotation: u3, textAnchor: c3 };
    }({ axis: n2, width: r2, height: t2, position: c2, offsetX: p2, offsetY: g2, orientation: m2 });
    s = jsx("text", { transform: "translate(" + R.x + ", " + R.y + ") rotate(" + R.rotation + ")", textAnchor: R.textAnchor, dominantBaseline: "central", style: a2, children: d });
  }
  return jsxs("g", { transform: "translate(" + v2 + ", " + w2 + ")", children: [jsx("line", { x1: 0, x2: _2, y1: 0, y2: k2, stroke: y2.markers.lineColor, strokeWidth: y2.markers.lineStrokeWidth, style: l2 }), s] });
};
_n.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, axis: c$3.oneOf(["x", "y"]).isRequired, scale: c$3.func.isRequired, value: c$3.oneOfType([c$3.number, c$3.string, c$3.instanceOf(Date)]).isRequired, lineStyle: c$3.object, textStyle: c$3.object, legend: c$3.string, legendPosition: c$3.oneOf(["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]), legendOffsetX: c$3.number.isRequired, legendOffsetY: c$3.number.isRequired, legendOrientation: c$3.oneOf(["horizontal", "vertical"]).isRequired };
var wn = memo(_n), kn$1 = function(e3) {
  var r2 = e3.markers, t2 = e3.width, n2 = e3.height, i2 = e3.xScale, o2 = e3.yScale;
  return r2 && 0 !== r2.length ? r2.map(function(e4, r3) {
    return jsx(wn, jr({}, e4, { width: t2, height: n2, scale: "y" === e4.axis ? o2 : i2 }), r3);
  }) : null;
};
kn$1.propTypes = { width: c$3.number.isRequired, height: c$3.number.isRequired, xScale: c$3.func.isRequired, yScale: c$3.func.isRequired, markers: c$3.arrayOf(c$3.shape({ axis: c$3.oneOf(["x", "y"]).isRequired, value: c$3.oneOfType([c$3.number, c$3.string, c$3.instanceOf(Date)]).isRequired, lineStyle: c$3.object, textStyle: c$3.object })) };
var Rn = memo(kn$1), xn$1 = ["theme", "renderWrapper", "animate", "motionConfig"], On = function(e3) {
  return function(r2) {
    var t2, n2;
    function i2() {
      return r2.apply(this, arguments) || this;
    }
    return n2 = r2, (t2 = i2).prototype = Object.create(n2.prototype), t2.prototype.constructor = t2, Sr(t2, n2), i2.prototype.render = function() {
      var r3 = this.props, t3 = r3.theme, n3 = r3.renderWrapper, i3 = r3.animate, o2 = r3.motionConfig, l2 = Br(r3, xn$1);
      return jsx(St, { theme: t3, renderWrapper: n3, isInteractive: l2.isInteractive, animate: i3, motionConfig: o2, children: jsx(e3, jr({}, l2)) });
    }, i2;
  }(Component);
}, qn = function(e3, r2) {
  var n2 = Qe(e3) ? e3 : function(r3) {
    return y$2(r3, e3);
  };
  return n2;
}, Mn = function(e3, r2, t2, n2) {
  var i2 = t2 - e3, o2 = n2 - r2;
  return i2 *= i2, o2 *= o2, Math.sqrt(i2 + o2);
}, jn = function(e3, r2, t2, n2, i2, o2) {
  return e3 <= i2 && i2 <= e3 + t2 && r2 <= o2 && o2 <= r2 + n2;
}, Sn = function(e3, r2) {
  var t2, n2 = "touches" in r2 ? r2.touches[0] : r2, i2 = n2.clientX, o2 = n2.clientY, l2 = e3.getBoundingClientRect(), a2 = (t2 = void 0 !== e3.getBBox ? e3.getBBox() : { width: e3.offsetWidth || 0, height: e3.offsetHeight || 0 }).width === l2.width ? 1 : t2.width / l2.width;
  return [(i2 - l2.left) * a2, (o2 - l2.top) * a2];
}, Bn = Object.keys(Et), Gn = Object.keys(un$1), Ln = function(e3, r2, t2) {
  if ("*" === e3) return true;
  if (Qe(e3)) return e3(r2);
  if (je(e3)) {
    var n2 = t2 ? y$2(r2, t2) : r2;
    return Mr(Tr(n2, Object.keys(e3)), e3);
  }
  return false;
}, In = function(e3, r2, t2, n2) {
  var i2 = {}, o2 = i2.dataKey, l2 = i2.colorKey, a2 = void 0 === l2 ? "color" : l2, d = i2.targetKey, s = void 0 === d ? "fill" : d, u2 = [], c2 = {};
  return e3.length && r2.length && (u2 = [].concat(e3), r2.forEach(function(r3) {
    for (var n3 = function() {
      var n4 = t2[i3], l3 = n4.id, d2 = n4.match;
      if (Ln(d2, r3, o2)) {
        var f2 = e3.find(function(e4) {
          return e4.id === l3;
        });
        if (f2) {
          if (Gn.includes(f2.type)) if ("inherit" === f2.background || "inherit" === f2.color) {
            var p2 = y$2(r3, a2), h = f2.background, g2 = f2.color, b2 = l3;
            "inherit" === f2.background && (b2 = b2 + ".bg." + p2, h = p2), "inherit" === f2.color && (b2 = b2 + ".fg." + p2, g2 = p2), v$8(r3, s, "url(#" + b2 + ")"), c2[b2] || (u2.push(jr({}, f2, { id: b2, background: h, color: g2 })), c2[b2] = 1);
          } else v$8(r3, s, "url(#" + l3 + ")");
          else if (Bn.includes(f2.type)) {
            if (f2.colors.map(function(e4) {
              return e4.color;
            }).includes("inherit")) {
              var m2 = y$2(r3, a2), _2 = l3, w2 = jr({}, f2, { colors: f2.colors.map(function(e4, r4) {
                return "inherit" !== e4.color ? e4 : (_2 = _2 + "." + r4 + "." + m2, jr({}, e4, { color: "inherit" === e4.color ? m2 : e4.color }));
              }) });
              w2.id = _2, v$8(r3, s, "url(#" + _2 + ")"), c2[_2] || (u2.push(w2), c2[_2] = 1);
            } else v$8(r3, s, "url(#" + l3 + ")");
          }
        }
        return "break";
      }
    }, i3 = 0; i3 < t2.length; i3++) {
      if ("break" === n3()) break;
    }
  })), u2;
};
function qe() {
  return qe = Object.assign ? Object.assign.bind() : function(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var n2 = arguments[r2];
      for (var t2 in n2) Object.prototype.hasOwnProperty.call(n2, t2) && (e3[t2] = n2[t2]);
    }
    return e3;
  }, qe.apply(this, arguments);
}
function Ce(e3, r2) {
  (null == r2 || r2 > e3.length) && (r2 = e3.length);
  for (var n2 = 0, t2 = new Array(r2); n2 < r2; n2++) t2[n2] = e3[n2];
  return t2;
}
function Ge(e3, r2) {
  var n2 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
  if (n2) return (n2 = n2.call(e3)).next.bind(n2);
  if (Array.isArray(e3) || (n2 = function(e4, r3) {
    if (e4) {
      if ("string" == typeof e4) return Ce(e4, r3);
      var n3 = Object.prototype.toString.call(e4).slice(8, -1);
      return "Object" === n3 && e4.constructor && (n3 = e4.constructor.name), "Map" === n3 || "Set" === n3 ? Array.from(e4) : "Arguments" === n3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3) ? Ce(e4, r3) : void 0;
    }
  }(e3)) || r2) {
    n2 && (e3 = n2);
    var t2 = 0;
    return function() {
      return t2 >= e3.length ? { done: true } : { done: false, value: e3[t2++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var Re = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: e, accent: r, dark2: n, paired: t, pastel1: o, pastel2: i, set1: u$2, set2: a, set3: l, tableau10: c$2 }, Ve = Object.keys(Re), Pe = { brown_blueGreen: scheme$q, purpleRed_green: scheme$p, pink_yellowGreen: scheme$o, purple_orange: scheme$n, red_blue: scheme$m, red_grey: scheme$l, red_yellow_blue: scheme$k, red_yellow_green: scheme$j, spectral: scheme$i }, Te = Object.keys(Pe), Ue = { brown_blueGreen: v$6, purpleRed_green: _$3, pink_yellowGreen: w$5, purple_orange: k$5, red_blue: j$6, red_grey: A$2, red_yellow_blue: O$4, red_yellow_green: z$4, spectral: E$7 }, De = { blues: scheme$5, greens: scheme$4, greys: scheme$3, oranges: scheme, purples: scheme$2, reds: scheme$1, blue_green: scheme$h, blue_purple: scheme$g, green_blue: scheme$f, orange_red: scheme$e, purple_blue_green: scheme$d, purple_blue: scheme$c, purple_red: scheme$b, red_purple: scheme$a, yellow_green_blue: scheme$9, yellow_green: scheme$8, yellow_orange_brown: scheme$7, yellow_orange_red: scheme$6 }, Me = Object.keys(De), $e = { blues: K$3, greens: L$3, greys: N$6, oranges: Q$4, purples: W$4, reds: X$5, turbo: Y$6, viridis: Z$2, inferno, magma, plasma, cividis: te$1, warm, cool, cubehelixDefault: ue$1, blue_green: ae$1, blue_purple: le$1, green_blue: ce$1, orange_red: se$1, purple_blue_green: fe$1, purple_blue: pe$1, purple_red: de$1, red_purple: me$1, yellow_green_blue: he$1, yellow_green: ge$1, yellow_orange_brown: ye, yellow_orange_red: be }, Be = qe({}, Re, Pe, De), He = function(e3) {
  return Ve.includes(e3);
}, Je = function(e3) {
  return Te.includes(e3);
}, Ke = function(e3) {
  return Me.includes(e3);
}, Le = { rainbow: ve$1, sinebow: _e };
qe({}, Ue, $e, Le);
var We = function(e3, r2) {
  if ("function" == typeof e3) return e3;
  if (je(e3)) {
    if (function(e4) {
      return void 0 !== e4.theme;
    }(e3)) {
      if (void 0 === r2) throw new Error("Unable to use color from theme as no theme was provided");
      var n2 = y$2(r2, e3.theme);
      if (void 0 === n2) throw new Error("Color from theme is undefined at path: '" + e3.theme + "'");
      return function() {
        return n2;
      };
    }
    if (function(e4) {
      return void 0 !== e4.from;
    }(e3)) {
      var t2 = function(r3) {
        return y$2(r3, e3.from);
      };
      if (Array.isArray(e3.modifiers)) {
        for (var o2, i2 = [], u2 = function() {
          var e4 = o2.value, r3 = e4[0], n3 = e4[1];
          if ("brighter" === r3) i2.push(function(e6) {
            return e6.brighter(n3);
          });
          else if ("darker" === r3) i2.push(function(e6) {
            return e6.darker(n3);
          });
          else {
            if ("opacity" !== r3) throw new Error("Invalid color modifier: '" + r3 + "', must be one of: 'brighter', 'darker', 'opacity'");
            i2.push(function(e6) {
              return e6.opacity = n3, e6;
            });
          }
        }, a2 = Ge(e3.modifiers); !(o2 = a2()).done; ) u2();
        return 0 === i2.length ? t2 : function(e4) {
          return i2.reduce(function(e6, r3) {
            return r3(e6);
          }, rgb$1(t2(e4))).toString();
        };
      }
      return t2;
    }
    throw new Error("Invalid color spec, you should either specify 'theme' or 'from' when using a config object");
  }
  return function() {
    return e3;
  };
}, Xe = function(e3, r2) {
  return useMemo(function() {
    return We(e3, r2);
  }, [e3, r2]);
};
c$3.oneOfType([c$3.string, c$3.func, c$3.shape({ theme: c$3.string.isRequired }), c$3.shape({ from: c$3.string.isRequired, modifiers: c$3.arrayOf(c$3.array) })]);
var fr = function(e3, r2) {
  if ("function" == typeof e3) return e3;
  var n2 = function(e4) {
    return y$2(e4, r2);
  };
  if (Array.isArray(e3)) {
    var t2 = ordinal(e3), o2 = function(e4) {
      return t2(n2(e4));
    };
    return o2.scale = t2, o2;
  }
  if (je(e3)) {
    if (function(e4) {
      return void 0 !== e4.datum;
    }(e3)) return function(r3) {
      return y$2(r3, e3.datum);
    };
    if (function(e4) {
      return void 0 !== e4.scheme;
    }(e3)) {
      if (He(e3.scheme)) {
        var i2 = ordinal(Be[e3.scheme]), u2 = function(e4) {
          return i2(n2(e4));
        };
        return u2.scale = i2, u2;
      }
      if (Je(e3.scheme)) {
        if (void 0 !== e3.size && (e3.size < 3 || e3.size > 11)) throw new Error("Invalid size '" + e3.size + "' for diverging color scheme '" + e3.scheme + "', must be between 3~11");
        var a2 = ordinal(Be[e3.scheme][e3.size || 11]), l2 = function(e4) {
          return a2(n2(e4));
        };
        return l2.scale = a2, l2;
      }
      if (Ke(e3.scheme)) {
        if (void 0 !== e3.size && (e3.size < 3 || e3.size > 9)) throw new Error("Invalid size '" + e3.size + "' for sequential color scheme '" + e3.scheme + "', must be between 3~9");
        var c2 = ordinal(Be[e3.scheme][e3.size || 9]), s = function(e4) {
          return c2(n2(e4));
        };
        return s.scale = c2, s;
      }
    }
    throw new Error("Invalid colors, when using an object, you should either pass a 'datum' or a 'scheme' property");
  }
  return function() {
    return e3;
  };
}, pr = function(e3, r2) {
  return useMemo(function() {
    return fr(e3, r2);
  }, [e3, r2]);
};
function $$1() {
  return $$1 = Object.assign ? Object.assign.bind() : function(n2) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var r2 = arguments[t2];
      for (var e3 in r2) Object.prototype.hasOwnProperty.call(r2, e3) && (n2[e3] = r2[e3]);
    }
    return n2;
  }, $$1.apply(this, arguments);
}
var J = [function(n2) {
  return n2.setMilliseconds(0);
}, function(n2) {
  return n2.setSeconds(0);
}, function(n2) {
  return n2.setMinutes(0);
}, function(n2) {
  return n2.setHours(0);
}, function(n2) {
  return n2.setDate(1);
}, function(n2) {
  return n2.setMonth(0);
}], K = { millisecond: [], second: J.slice(0, 1), minute: J.slice(0, 2), hour: J.slice(0, 3), day: J.slice(0, 4), month: J.slice(0, 5), year: J.slice(0, 6) }, L$1 = function(n2) {
  return function(t2) {
    return K[n2].forEach(function(n3) {
      n3(t2);
    }), t2;
  };
}, Q$1 = function(n2) {
  var t2 = n2.format, r2 = void 0 === t2 ? "native" : t2, e3 = n2.precision, a2 = void 0 === e3 ? "millisecond" : e3, u2 = n2.useUTC, c2 = void 0 === u2 || u2, s = L$1(a2);
  return function(n3) {
    if (void 0 === n3) return n3;
    if ("native" === r2 || n3 instanceof Date) return s(n3);
    var t3 = c2 ? utcParse(r2) : timeParse(r2);
    return s(t3(n3));
  };
}, W$2 = function(n2, t2, r2, e3) {
  var a2, i2, o2, c2, s = n2.min, d = void 0 === s ? 0 : s, f2 = n2.max, l2 = void 0 === f2 ? "auto" : f2, m2 = n2.stacked, v2 = void 0 !== m2 && m2, y2 = n2.reverse, p2 = void 0 !== y2 && y2, h = n2.clamp, g2 = void 0 !== h && h, x2 = n2.nice, k2 = void 0 !== x2 && x2;
  "auto" === d ? a2 = true === v2 ? null != (i2 = t2.minStacked) ? i2 : 0 : t2.min : a2 = d;
  "auto" === l2 ? o2 = true === v2 ? null != (c2 = t2.maxStacked) ? c2 : 0 : t2.max : o2 = l2;
  var T2 = linear().rangeRound("x" === e3 ? [0, r2] : [r2, 0]).domain(p2 ? [o2, a2] : [a2, o2]).clamp(g2);
  return true === k2 ? T2.nice() : "number" == typeof k2 && T2.nice(k2), X$2(T2, v2);
}, X$2 = function(n2, t2) {
  void 0 === t2 && (t2 = false);
  var r2 = n2;
  return r2.type = "linear", r2.stacked = t2, r2;
}, Y$2 = function(n2, t2, r2) {
  var e3 = point$4().range([0, r2]).domain(t2.all);
  return e3.type = "point", e3;
}, _$1 = function(n2, t2, r2, e3) {
  var a2 = n2.round, i2 = void 0 === a2 || a2, o2 = band().range("x" === e3 ? [0, r2] : [r2, 0]).domain(t2.all).round(i2);
  return nn(o2);
}, nn = function(n2) {
  var t2 = n2;
  return t2.type = "band", t2;
}, tn = function(n2, t2, r2) {
  var e3, a2, i2 = n2.format, o2 = void 0 === i2 ? "native" : i2, u2 = n2.precision, c2 = void 0 === u2 ? "millisecond" : u2, s = n2.min, l2 = void 0 === s ? "auto" : s, m2 = n2.max, v2 = void 0 === m2 ? "auto" : m2, y2 = n2.useUTC, p2 = void 0 === y2 || y2, h = n2.nice, g2 = void 0 !== h && h, x2 = Q$1({ format: o2, precision: c2, useUTC: p2 });
  e3 = "auto" === l2 ? x2(t2.min) : "native" !== o2 ? x2(l2) : l2, a2 = "auto" === v2 ? x2(t2.max) : "native" !== o2 ? x2(v2) : v2;
  var k2 = p2 ? utcTime() : time();
  k2.range([0, r2]), e3 && a2 && k2.domain([e3, a2]), true === g2 ? k2.nice() : "object" != typeof g2 && "number" != typeof g2 || k2.nice(g2);
  var T2 = k2;
  return T2.type = "time", T2.useUTC = p2, T2;
}, rn = function(n2, t2, r2, e3) {
  var a2, i2 = n2.base, o2 = void 0 === i2 ? 10 : i2, u2 = n2.min, c2 = void 0 === u2 ? "auto" : u2, s = n2.max, d = void 0 === s ? "auto" : s;
  if (t2.all.some(function(n3) {
    return 0 === n3;
  })) throw new Error("a log scale domain must not include or cross zero");
  var f2, m2, v2 = false;
  if (t2.all.filter(function(n3) {
    return null != n3;
  }).forEach(function(n3) {
    v2 || (void 0 === a2 ? a2 = Math.sign(n3) : Math.sign(n3) !== a2 && (v2 = true));
  }), v2) throw new Error("a log scale domain must be strictly-positive or strictly-negative");
  f2 = "auto" === c2 ? t2.min : c2, m2 = "auto" === d ? t2.max : d;
  var y2 = log().domain([f2, m2]).rangeRound("x" === e3 ? [0, r2] : [r2, 0]).base(o2).nice();
  return y2.type = "log", y2;
}, en = function(n2, t2, r2, e3) {
  var a2, i2, o2 = n2.constant, u2 = void 0 === o2 ? 1 : o2, c2 = n2.min, s = void 0 === c2 ? "auto" : c2, d = n2.max, f2 = void 0 === d ? "auto" : d, l2 = n2.reverse, v2 = void 0 !== l2 && l2;
  a2 = "auto" === s ? t2.min : s, i2 = "auto" === f2 ? t2.max : f2;
  var y2 = symlog().constant(u2).rangeRound("x" === e3 ? [0, r2] : [r2, 0]).nice();
  true === v2 ? y2.domain([i2, a2]) : y2.domain([a2, i2]);
  var p2 = y2;
  return p2.type = "symlog", p2;
}, an = function(n2) {
  return "x" === n2 ? "y" : "x";
}, on = function(n2, t2) {
  return n2 === t2;
}, un = function(n2, t2) {
  return n2.getTime() === t2.getTime();
};
function cn(n2, t2, r2, e3) {
  switch (n2.type) {
    case "linear":
      return W$2(n2, t2, r2, e3);
    case "point":
      return Y$2(n2, t2, r2);
    case "band":
      return _$1(n2, t2, r2, e3);
    case "time":
      return tn(n2, t2, r2);
    case "log":
      return rn(n2, t2, r2, e3);
    case "symlog":
      return en(n2, t2, r2, e3);
    default:
      throw new Error("invalid scale spec");
  }
}
var sn = function(n2, t2, r2) {
  var e3;
  if ("stacked" in r2 && r2.stacked) {
    var a2 = n2.data["x" === t2 ? "xStacked" : "yStacked"];
    return null == a2 ? null : r2(a2);
  }
  return null != (e3 = r2(n2.data[t2])) ? e3 : null;
}, dn = function(n2, t2, r2, e3, a2) {
  var i2 = n2.map(function(n3) {
    return function(n4) {
      return $$1({}, n4, { data: n4.data.map(function(n5) {
        return { data: $$1({}, n5) };
      }) });
    }(n3);
  }), o2 = fn(i2, t2, r2);
  "stacked" in t2 && true === t2.stacked && vn(o2, i2), "stacked" in r2 && true === r2.stacked && yn(o2, i2);
  var u2 = cn(t2, o2.x, e3, "x"), c2 = cn(r2, o2.y, a2, "y"), s = i2.map(function(n3) {
    return $$1({}, n3, { data: n3.data.map(function(n4) {
      return $$1({}, n4, { position: { x: sn(n4, "x", u2), y: sn(n4, "y", c2) } });
    }) });
  });
  return $$1({}, o2, { series: s, xScale: u2, yScale: c2 });
}, fn = function(n2, t2, r2) {
  return { x: ln(n2, "x", t2), y: ln(n2, "y", r2) };
}, ln = function(a2, i2, o2, u2) {
  var c2 = {}, s = c2.getValue, d = void 0 === s ? function(n2) {
    return n2.data[i2];
  } : s, f2 = c2.setValue, l2 = void 0 === f2 ? function(n2, t2) {
    n2.data[i2] = t2;
  } : f2;
  if ("linear" === o2.type) a2.forEach(function(n2) {
    n2.data.forEach(function(n3) {
      var t2 = d(n3);
      t2 && l2(n3, parseFloat(String(t2)));
    });
  });
  else if ("time" === o2.type && "native" !== o2.format) {
    var m2 = Q$1(o2);
    a2.forEach(function(n2) {
      n2.data.forEach(function(n3) {
        var t2 = d(n3);
        t2 && l2(n3, m2(t2));
      });
    });
  }
  var v2 = [];
  switch (a2.forEach(function(n2) {
    n2.data.forEach(function(n3) {
      v2.push(d(n3));
    });
  }), o2.type) {
    case "linear":
      var y2 = r$1(n$1(v2).filter(function(n2) {
        return null !== n2;
      }), function(n2) {
        return n2;
      });
      return { all: y2, min: Math.min.apply(Math, y2), max: Math.max.apply(Math, y2) };
    case "time":
      var p2 = t$1(v2, function(n2) {
        return n2.getTime();
      }).slice(0).sort(function(n2, t2) {
        return t2.getTime() - n2.getTime();
      }).reverse();
      return { all: p2, min: p2[0], max: W$5(p2) };
    default:
      var h = n$1(v2);
      return { all: h, min: h[0], max: W$5(h) };
  }
}, mn = function(n2, t2, r2) {
  var i2 = an(n2), o2 = [];
  t2[i2].all.forEach(function(t3) {
    var u2 = a$1(t3) ? un : on, c2 = [];
    r2.forEach(function(r3) {
      var a2 = r3.data.find(function(n3) {
        return u2(n3.data[i2], t3);
      }), s = null, d = null;
      if (void 0 !== a2) {
        if (null !== (s = a2.data[n2])) {
          var f2 = W$5(c2);
          void 0 === f2 ? d = s : null !== f2 && (d = f2 + s);
        }
        a2.data["x" === n2 ? "xStacked" : "yStacked"] = d;
      }
      c2.push(d), null !== d && o2.push(d);
    });
  }), t2[n2].minStacked = Math.min.apply(Math, o2), t2[n2].maxStacked = Math.max.apply(Math, o2);
}, vn = function(n2, t2) {
  return mn("x", n2, t2);
}, yn = function(n2, t2) {
  return mn("y", n2, t2);
}, pn = function(n2) {
  var t2 = n2.bandwidth();
  if (0 === t2) return n2;
  var r2 = t2 / 2;
  return n2.round() && (r2 = Math.round(r2)), function(t3) {
    var e3;
    return (null != (e3 = n2(t3)) ? e3 : 0) + r2;
  };
}, hn = { millisecond: [millisecond, millisecond], second: [second, second], minute: [minute, utcMinute], hour: [hour, utcHour], day: [newInterval(function(n2) {
  return n2.setHours(0, 0, 0, 0);
}, function(n2, t2) {
  return n2.setDate(n2.getDate() + t2);
}, function(n2, t2) {
  return (t2.getTime() - n2.getTime()) / 864e5;
}, function(n2) {
  return Math.floor(n2.getTime() / 864e5);
}), newInterval(function(n2) {
  return n2.setUTCHours(0, 0, 0, 0);
}, function(n2, t2) {
  return n2.setUTCDate(n2.getUTCDate() + t2);
}, function(n2, t2) {
  return (t2.getTime() - n2.getTime()) / 864e5;
}, function(n2) {
  return Math.floor(n2.getTime() / 864e5);
})], week: [sunday, utcSunday], sunday: [sunday, utcSunday], monday: [monday, utcMonday], tuesday: [tuesday, utcTuesday], wednesday: [wednesday, utcWednesday], thursday: [thursday, utcThursday], friday: [friday, utcFriday], saturday: [saturday, utcSaturday], month: [month, utcMonth], year: [year, utcYear] }, gn = Object.keys(hn), xn = new RegExp("^every\\s*(\\d+)?\\s*(" + gn.join("|") + ")s?$", "i"), kn = function(n2, t2) {
  if (Array.isArray(t2)) return t2;
  if ("string" == typeof t2 && "useUTC" in n2) {
    var r2 = t2.match(xn);
    if (r2) {
      var e3 = r2[1], a2 = r2[2], i2 = hn[a2][n2.useUTC ? 1 : 0];
      if ("day" === a2) {
        var o2, u2, c2 = n2.domain(), s = c2[0], d = c2[1], f2 = new Date(d);
        return f2.setDate(f2.getDate() + 1), null != (o2 = null == (u2 = i2.every(Number(null != e3 ? e3 : 1))) ? void 0 : u2.range(s, f2)) ? o2 : [];
      }
      if (void 0 === e3) return n2.ticks(i2);
      var l2 = i2.every(Number(e3));
      if (l2) return n2.ticks(l2);
    }
    throw new Error("Invalid tickValues: " + t2);
  }
  if ("ticks" in n2) {
    if (void 0 === t2) return n2.ticks();
    if ("number" == typeof (m2 = t2) && isFinite(m2) && Math.floor(m2) === m2) return n2.ticks(t2);
  }
  var m2;
  return n2.domain();
};
function p$1() {
  return p$1 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var e3 = 1; e3 < arguments.length; e3++) {
      var i2 = arguments[e3];
      for (var n2 in i2) Object.prototype.hasOwnProperty.call(i2, n2) && (t2[n2] = i2[n2]);
    }
    return t2;
  }, p$1.apply(this, arguments);
}
var b$3 = function(t2) {
  var e3, i2 = t2.axis, n2 = t2.scale, r2 = t2.ticksPosition, o2 = t2.tickValues, l2 = t2.tickSize, s = t2.tickPadding, c2 = t2.tickRotation, f2 = t2.truncateTickAt, u2 = t2.engine, d = void 0 === u2 ? "svg" : u2, x2 = kn(n2, o2), m2 = rn$1[d], k2 = "bandwidth" in n2 ? pn(n2) : n2, g2 = { lineX: 0, lineY: 0 }, v2 = { textX: 0, textY: 0 }, b2 = "object" == typeof document && "rtl" === document.dir, P2 = m2.align.center, T2 = m2.baseline.center;
  "x" === i2 ? (e3 = function(t3) {
    var e4;
    return { x: null != (e4 = k2(t3)) ? e4 : 0, y: 0 };
  }, g2.lineY = l2 * ("after" === r2 ? 1 : -1), v2.textY = (l2 + s) * ("after" === r2 ? 1 : -1), T2 = "after" === r2 ? m2.baseline.top : m2.baseline.bottom, 0 === c2 ? P2 = m2.align.center : "after" === r2 && c2 < 0 || "before" === r2 && c2 > 0 ? (P2 = m2.align[b2 ? "left" : "right"], T2 = m2.baseline.center) : ("after" === r2 && c2 > 0 || "before" === r2 && c2 < 0) && (P2 = m2.align[b2 ? "right" : "left"], T2 = m2.baseline.center)) : (e3 = function(t3) {
    var e4;
    return { x: 0, y: null != (e4 = k2(t3)) ? e4 : 0 };
  }, g2.lineX = l2 * ("after" === r2 ? 1 : -1), v2.textX = (l2 + s) * ("after" === r2 ? 1 : -1), P2 = "after" === r2 ? m2.align.left : m2.align.right);
  return { ticks: x2.map(function(t3) {
    var i3 = "string" == typeof t3 ? function(t4) {
      var e4 = String(t4).length;
      return f2 && f2 > 0 && e4 > f2 ? "" + String(t4).slice(0, f2).concat("...") : "" + t4;
    }(t3) : t3;
    return p$1({ key: t3 instanceof Date ? "" + t3.valueOf() : "" + t3, value: i3 }, e3(t3), g2, v2);
  }), textAlign: P2, textBaseline: T2 };
}, P$3 = function(t2, e3) {
  if (void 0 === t2 || "function" == typeof t2) return t2;
  if ("time" === e3.type) {
    var i2 = timeFormat(t2);
    return function(t3) {
      return i2(t3 instanceof Date ? t3 : new Date(t3));
    };
  }
  return format(t2);
}, T$3 = function(t2) {
  var e3, i2 = t2.width, n2 = t2.height, r2 = t2.scale, a2 = t2.axis, o2 = t2.values, l2 = (e3 = o2, Array.isArray(e3) ? o2 : void 0) || kn(r2, o2), s = "bandwidth" in r2 ? pn(r2) : r2, c2 = "x" === a2 ? l2.map(function(t3) {
    var e4, i3;
    return { key: t3 instanceof Date ? "" + t3.valueOf() : "" + t3, x1: null != (e4 = s(t3)) ? e4 : 0, x2: null != (i3 = s(t3)) ? i3 : 0, y1: 0, y2: n2 };
  }) : l2.map(function(t3) {
    var e4, n3;
    return { key: t3 instanceof Date ? "" + t3.valueOf() : "" + t3, x1: 0, x2: i2, y1: null != (e4 = s(t3)) ? e4 : 0, y2: null != (n3 = s(t3)) ? n3 : 0 };
  });
  return c2;
}, A = memo(function(t2) {
  var e3, n2 = t2.value, r2 = t2.format, a2 = t2.lineX, s = t2.lineY, c2 = t2.onClick, u2 = t2.textBaseline, d = t2.textAnchor, x2 = t2.animatedProps, m2 = zt(), y2 = m2.axis.ticks.line, h = m2.axis.ticks.text, v2 = null != (e3 = null == r2 ? void 0 : r2(n2)) ? e3 : n2, b2 = useMemo(function() {
    var t3 = { opacity: x2.opacity };
    return c2 ? { style: p$1({}, t3, { cursor: "pointer" }), onClick: function(t4) {
      return c2(t4, v2);
    } } : { style: t3 };
  }, [x2.opacity, c2, v2]);
  return jsxs(animated.g, p$1({ transform: x2.transform }, b2, { children: [jsx("line", { x1: 0, x2: a2, y1: 0, y2: s, style: y2 }), h.outlineWidth > 0 && jsx(animated.text, { dominantBaseline: u2, textAnchor: d, transform: x2.textTransform, style: h, strokeWidth: 2 * h.outlineWidth, stroke: h.outlineColor, strokeLinejoin: "round", children: "" + v2 }), jsx(animated.text, { dominantBaseline: u2, textAnchor: d, transform: x2.textTransform, style: Mt(h), children: "" + v2 })] }));
}), S$1 = function(e3) {
  var r2 = e3.axis, a2 = e3.scale, l2 = e3.x, c2 = void 0 === l2 ? 0 : l2, x2 = e3.y, m2 = void 0 === x2 ? 0 : x2, y2 = e3.length, h = e3.ticksPosition, T2 = e3.tickValues, S2 = e3.tickSize, W2 = void 0 === S2 ? 5 : S2, w2 = e3.tickPadding, B2 = void 0 === w2 ? 5 : w2, X2 = e3.tickRotation, Y2 = void 0 === X2 ? 0 : X2, C2 = e3.format, O2 = e3.renderTick, j2 = void 0 === O2 ? A : O2, z2 = e3.truncateTickAt, V2 = e3.legend, D2 = e3.legendPosition, R = void 0 === D2 ? "end" : D2, E2 = e3.legendOffset, q2 = void 0 === E2 ? 0 : E2, F2 = e3.onClick, L2 = e3.ariaHidden, N2 = zt(), H2 = N2.axis.legend.text, I2 = useMemo(function() {
    return P$3(C2, a2);
  }, [C2, a2]), J2 = b$3({ axis: r2, scale: a2, ticksPosition: h, tickValues: T2, tickSize: W2, tickPadding: B2, tickRotation: Y2, truncateTickAt: z2 }), G2 = J2.ticks, K2 = J2.textAlign, M2 = J2.textBaseline, Q2 = null;
  if (void 0 !== V2) {
    var U2, Z2 = 0, $2 = 0, _2 = 0;
    "y" === r2 ? (_2 = -90, Z2 = q2, "start" === R ? (U2 = "start", $2 = y2) : "middle" === R ? (U2 = "middle", $2 = y2 / 2) : "end" === R && (U2 = "end")) : ($2 = q2, "start" === R ? U2 = "start" : "middle" === R ? (U2 = "middle", Z2 = y2 / 2) : "end" === R && (U2 = "end", Z2 = y2)), Q2 = jsxs(Fragment, { children: [H2.outlineWidth > 0 && jsx("text", { transform: "translate(" + Z2 + ", " + $2 + ") rotate(" + _2 + ")", textAnchor: U2, style: p$1({ dominantBaseline: "central" }, H2), strokeWidth: 2 * H2.outlineWidth, stroke: H2.outlineColor, strokeLinejoin: "round", children: V2 }), jsx("text", { transform: "translate(" + Z2 + ", " + $2 + ") rotate(" + _2 + ")", textAnchor: U2, style: p$1({ dominantBaseline: "central" }, H2), children: V2 })] });
  }
  var tt2 = Ur(), et2 = tt2.animate, it2 = tt2.config, nt2 = useSpring({ transform: "translate(" + c2 + "," + m2 + ")", lineX2: "x" === r2 ? y2 : 0, lineY2: "x" === r2 ? 0 : y2, config: it2, immediate: !et2 }), rt2 = useCallback(function(t2) {
    return { opacity: 1, transform: "translate(" + t2.x + "," + t2.y + ")", textTransform: "translate(" + t2.textX + "," + t2.textY + ") rotate(" + Y2 + ")" };
  }, [Y2]), at = useCallback(function(t2) {
    return { opacity: 0, transform: "translate(" + t2.x + "," + t2.y + ")", textTransform: "translate(" + t2.textX + "," + t2.textY + ") rotate(" + Y2 + ")" };
  }, [Y2]), ot = useTransition(G2, { keys: function(t2) {
    return t2.key;
  }, initial: rt2, from: at, enter: rt2, update: rt2, leave: { opacity: 0 }, config: it2, immediate: !et2 });
  return jsxs(animated.g, { transform: nt2.transform, "aria-hidden": L2, children: [ot(function(e4, i2, n2, r3) {
    return React.createElement(j2, p$1({ tickIndex: r3, format: I2, rotate: Y2, textBaseline: M2, textAnchor: K2, truncateTickAt: z2, animatedProps: e4 }, i2, F2 ? { onClick: F2 } : {}));
  }), jsx(animated.line, { style: N2.axis.domain.line, x1: 0, x2: nt2.lineX2, y1: 0, y2: nt2.lineY2 }), Q2] });
}, W$1 = memo(S$1), w$3 = ["top", "right", "bottom", "left"], B$1 = memo(function(t2) {
  var e3 = t2.xScale, i2 = t2.yScale, n2 = t2.width, r2 = t2.height, a2 = { top: t2.top, right: t2.right, bottom: t2.bottom, left: t2.left };
  return jsx(Fragment, { children: w$3.map(function(t3) {
    var o2 = a2[t3];
    if (!o2) return null;
    var l2 = "top" === t3 || "bottom" === t3;
    return jsx(W$1, p$1({}, o2, { axis: l2 ? "x" : "y", x: "right" === t3 ? n2 : 0, y: "bottom" === t3 ? r2 : 0, scale: l2 ? e3 : i2, length: l2 ? n2 : r2, ticksPosition: "top" === t3 || "left" === t3 ? "before" : "after", truncateTickAt: o2.truncateTickAt }), t3);
  }) });
}), X$1 = memo(function(t2) {
  var e3 = t2.animatedProps, i2 = zt();
  return jsx(animated.line, p$1({}, e3, i2.grid.line));
}), Y$1 = memo(function(t2) {
  var e3 = t2.lines, i2 = Ur(), n2 = i2.animate, a2 = i2.config, o2 = useTransition(e3, { keys: function(t3) {
    return t3.key;
  }, initial: function(t3) {
    return { opacity: 1, x1: t3.x1, x2: t3.x2, y1: t3.y1, y2: t3.y2 };
  }, from: function(t3) {
    return { opacity: 0, x1: t3.x1, x2: t3.x2, y1: t3.y1, y2: t3.y2 };
  }, enter: function(t3) {
    return { opacity: 1, x1: t3.x1, x2: t3.x2, y1: t3.y1, y2: t3.y2 };
  }, update: function(t3) {
    return { opacity: 1, x1: t3.x1, x2: t3.x2, y1: t3.y1, y2: t3.y2 };
  }, leave: { opacity: 0 }, config: a2, immediate: !n2 });
  return jsx("g", { children: o2(function(t3, e4) {
    return createElement(X$1, p$1({}, e4, { key: e4.key, animatedProps: t3 }));
  }) });
}), C$3 = memo(function(t2) {
  var e3 = t2.width, n2 = t2.height, r2 = t2.xScale, a2 = t2.yScale, o2 = t2.xValues, l2 = t2.yValues, s = useMemo(function() {
    return !!r2 && T$3({ width: e3, height: n2, scale: r2, axis: "x", values: o2 });
  }, [r2, o2, e3, n2]), c2 = useMemo(function() {
    return !!a2 && T$3({ width: e3, height: n2, scale: a2, axis: "y", values: l2 });
  }, [n2, e3, a2, l2]);
  return jsxs(Fragment, { children: [s && jsx(Y$1, { lines: s }), c2 && jsx(Y$1, { lines: c2 })] });
}), O$1 = function(t2, e3) {
  var i2, n2 = e3.axis, r2 = e3.scale, a2 = e3.x, o2 = void 0 === a2 ? 0 : a2, l2 = e3.y, s = void 0 === l2 ? 0 : l2, f2 = e3.length, u2 = e3.ticksPosition, d = e3.tickValues, x2 = e3.tickSize, m2 = void 0 === x2 ? 5 : x2, y2 = e3.tickPadding, h = void 0 === y2 ? 5 : y2, k2 = e3.tickRotation, g2 = void 0 === k2 ? 0 : k2, v2 = e3.format, p2 = e3.legend, P2 = e3.legendPosition, T2 = void 0 === P2 ? "end" : P2, A2 = e3.legendOffset, S2 = void 0 === A2 ? 0 : A2, W2 = e3.theme, w2 = b$3({ axis: n2, scale: r2, ticksPosition: u2, tickValues: d, tickSize: m2, tickPadding: h, tickRotation: g2, engine: "canvas" }), B2 = w2.ticks, X2 = w2.textAlign, Y2 = w2.textBaseline;
  t2.save(), t2.translate(o2, s), t2.textAlign = X2, t2.textBaseline = Y2;
  var C2 = W2.axis.ticks.text;
  t2.font = (C2.fontWeight ? C2.fontWeight + " " : "") + C2.fontSize + "px " + C2.fontFamily, (null != (i2 = W2.axis.domain.line.strokeWidth) ? i2 : 0) > 0 && (t2.lineWidth = Number(W2.axis.domain.line.strokeWidth), t2.lineCap = "square", W2.axis.domain.line.stroke && (t2.strokeStyle = W2.axis.domain.line.stroke), t2.beginPath(), t2.moveTo(0, 0), t2.lineTo("x" === n2 ? f2 : 0, "x" === n2 ? 0 : f2), t2.stroke());
  var O2 = "function" == typeof v2 ? v2 : function(t3) {
    return "" + t3;
  };
  if (B2.forEach(function(e4) {
    var i3;
    (null != (i3 = W2.axis.ticks.line.strokeWidth) ? i3 : 0) > 0 && (t2.lineWidth = Number(W2.axis.ticks.line.strokeWidth), t2.lineCap = "square", W2.axis.ticks.line.stroke && (t2.strokeStyle = W2.axis.ticks.line.stroke), t2.beginPath(), t2.moveTo(e4.x, e4.y), t2.lineTo(e4.x + e4.lineX, e4.y + e4.lineY), t2.stroke());
    var n3 = O2(e4.value);
    t2.save(), t2.translate(e4.x + e4.textX, e4.y + e4.textY), t2.rotate(Ht(g2)), C2.outlineWidth > 0 && (t2.strokeStyle = C2.outlineColor, t2.lineWidth = 2 * C2.outlineWidth, t2.lineJoin = "round", t2.strokeText("" + n3, 0, 0)), W2.axis.ticks.text.fill && (t2.fillStyle = C2.fill), t2.fillText("" + n3, 0, 0), t2.restore();
  }), void 0 !== p2) {
    var j2 = 0, z2 = 0, V2 = 0, D2 = "center";
    "y" === n2 ? (V2 = -90, j2 = S2, "start" === T2 ? (D2 = "start", z2 = f2) : "middle" === T2 ? (D2 = "center", z2 = f2 / 2) : "end" === T2 && (D2 = "end")) : (z2 = S2, "start" === T2 ? D2 = "start" : "middle" === T2 ? (D2 = "center", j2 = f2 / 2) : "end" === T2 && (D2 = "end", j2 = f2)), t2.translate(j2, z2), t2.rotate(Ht(V2)), t2.font = (W2.axis.legend.text.fontWeight ? W2.axis.legend.text.fontWeight + " " : "") + W2.axis.legend.text.fontSize + "px " + W2.axis.legend.text.fontFamily, W2.axis.legend.text.fill && (t2.fillStyle = W2.axis.legend.text.fill), t2.textAlign = D2, t2.textBaseline = "middle", t2.fillText(p2, 0, 0);
  }
  t2.restore();
}, j$2 = function(t2, e3) {
  var i2 = e3.xScale, n2 = e3.yScale, r2 = e3.width, a2 = e3.height, o2 = e3.top, l2 = e3.right, s = e3.bottom, c2 = e3.left, f2 = e3.theme, u2 = { top: o2, right: l2, bottom: s, left: c2 };
  w$3.forEach(function(e4) {
    var o3 = u2[e4];
    if (!o3) return null;
    var l3 = "top" === e4 || "bottom" === e4, s2 = "top" === e4 || "left" === e4 ? "before" : "after", c3 = l3 ? i2 : n2, d = P$3(o3.format, c3);
    O$1(t2, p$1({}, o3, { axis: l3 ? "x" : "y", x: "right" === e4 ? r2 : 0, y: "bottom" === e4 ? a2 : 0, scale: c3, format: d, length: l3 ? r2 : a2, ticksPosition: s2, theme: f2 }));
  });
}, z$1 = function(t2, e3) {
  var i2 = e3.width, n2 = e3.height, r2 = e3.scale, a2 = e3.axis, o2 = e3.values;
  T$3({ width: i2, height: n2, scale: r2, axis: a2, values: o2 }).forEach(function(e4) {
    t2.beginPath(), t2.moveTo(e4.x1, e4.y1), t2.lineTo(e4.x2, e4.y2), t2.stroke();
  });
};
var f = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("circle", { r: o2 / 2, cx: i2 + o2 / 2, cy: n2 + o2 / 2, fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, style: { pointerEvents: "none" } });
}, m$2 = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("g", { transform: "translate(" + i2 + "," + n2 + ")", children: jsx("path", { d: "\n                    M" + o2 / 2 + " 0\n                    L" + 0.8 * o2 + " " + o2 / 2 + "\n                    L" + o2 / 2 + " " + o2 + "\n                    L" + 0.2 * o2 + " " + o2 / 2 + "\n                    L" + o2 / 2 + " 0\n                ", fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, style: { pointerEvents: "none" } }) });
}, v$2 = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("rect", { x: i2, y: n2, fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, width: o2, height: o2, style: { pointerEvents: "none" } });
}, u = function(e3) {
  var i2 = e3.x, n2 = e3.y, o2 = e3.size, r2 = e3.fill, l2 = e3.opacity, a2 = void 0 === l2 ? 1 : l2, c2 = e3.borderWidth, d = void 0 === c2 ? 0 : c2, s = e3.borderColor;
  return jsx("g", { transform: "translate(" + i2 + "," + n2 + ")", children: jsx("path", { d: "\n                M" + o2 / 2 + " 0\n                L" + o2 + " " + o2 + "\n                L0 " + o2 + "\n                L" + o2 / 2 + " 0\n            ", fill: r2, opacity: a2, strokeWidth: d, stroke: void 0 === s ? "transparent" : s, style: { pointerEvents: "none" } }) });
};
function p() {
  return p = Object.assign ? Object.assign.bind() : function(t2) {
    for (var e3 = 1; e3 < arguments.length; e3++) {
      var i2 = arguments[e3];
      for (var n2 in i2) Object.prototype.hasOwnProperty.call(i2, n2) && (t2[n2] = i2[n2]);
    }
    return t2;
  }, p.apply(this, arguments);
}
var k$2 = { top: 0, right: 0, bottom: 0, left: 0 }, x$2 = function(t2) {
  var e3, i2 = t2.direction, n2 = t2.itemsSpacing, o2 = t2.padding, r2 = t2.itemCount, l2 = t2.itemWidth, a2 = t2.itemHeight;
  if ("number" != typeof o2 && ("object" != typeof (e3 = o2) || Array.isArray(e3) || null === e3)) throw new Error("Invalid property padding, must be one of: number, object");
  var c2 = "number" == typeof o2 ? { top: o2, right: o2, bottom: o2, left: o2 } : p({}, k$2, o2), d = c2.left + c2.right, s = c2.top + c2.bottom, h = l2 + d, g2 = a2 + s, f2 = (r2 - 1) * n2;
  return "row" === i2 ? h = l2 * r2 + f2 + d : "column" === i2 && (g2 = a2 * r2 + f2 + s), { width: h, height: g2, padding: c2 };
}, b$2 = function(t2) {
  var e3 = t2.anchor, i2 = t2.translateX, n2 = t2.translateY, o2 = t2.containerWidth, r2 = t2.containerHeight, l2 = t2.width, a2 = t2.height, c2 = i2, d = n2;
  switch (e3) {
    case "top":
      c2 += (o2 - l2) / 2;
      break;
    case "top-right":
      c2 += o2 - l2;
      break;
    case "right":
      c2 += o2 - l2, d += (r2 - a2) / 2;
      break;
    case "bottom-right":
      c2 += o2 - l2, d += r2 - a2;
      break;
    case "bottom":
      c2 += (o2 - l2) / 2, d += r2 - a2;
      break;
    case "bottom-left":
      d += r2 - a2;
      break;
    case "left":
      d += (r2 - a2) / 2;
      break;
    case "center":
      c2 += (o2 - l2) / 2, d += (r2 - a2) / 2;
  }
  return { x: c2, y: d };
}, S = function(t2) {
  var e3, i2, n2, o2, r2, l2, a2 = t2.direction, c2 = t2.justify, d = t2.symbolSize, s = t2.symbolSpacing, h = t2.width, g2 = t2.height;
  switch (a2) {
    case "left-to-right":
      e3 = 0, i2 = (g2 - d) / 2, o2 = g2 / 2, l2 = "central", c2 ? (n2 = h, r2 = "end") : (n2 = d + s, r2 = "start");
      break;
    case "right-to-left":
      e3 = h - d, i2 = (g2 - d) / 2, o2 = g2 / 2, l2 = "central", c2 ? (n2 = 0, r2 = "start") : (n2 = h - d - s, r2 = "end");
      break;
    case "top-to-bottom":
      e3 = (h - d) / 2, i2 = 0, n2 = h / 2, r2 = "middle", c2 ? (o2 = g2, l2 = "alphabetic") : (o2 = d + s, l2 = "text-before-edge");
      break;
    case "bottom-to-top":
      e3 = (h - d) / 2, i2 = g2 - d, n2 = h / 2, r2 = "middle", c2 ? (o2 = 0, l2 = "text-before-edge") : (o2 = g2 - d - s, l2 = "alphabetic");
  }
  return { symbolX: e3, symbolY: i2, labelX: n2, labelY: o2, labelAnchor: r2, labelAlignment: l2 };
}, w$2 = { circle: f, diamond: m$2, square: v$2, triangle: u }, X = function(i2) {
  var n2, l2, a2, d, g2, f2, m2, v2, u2, y2, k2, x2 = i2.x, b2 = i2.y, A2 = i2.width, W2 = i2.height, z2 = i2.data, C2 = i2.direction, X2 = void 0 === C2 ? "left-to-right" : C2, Y2 = i2.justify, O2 = void 0 !== Y2 && Y2, B2 = i2.textColor, H2 = i2.background, E2 = void 0 === H2 ? "transparent" : H2, j2 = i2.opacity, L2 = void 0 === j2 ? 1 : j2, M2 = i2.symbolShape, F2 = void 0 === M2 ? "square" : M2, T2 = i2.symbolSize, P2 = void 0 === T2 ? 16 : T2, V2 = i2.symbolSpacing, R = void 0 === V2 ? 8 : V2, D2 = i2.symbolBorderWidth, q2 = void 0 === D2 ? 0 : D2, G2 = i2.symbolBorderColor, I2 = void 0 === G2 ? "transparent" : G2, N2 = i2.onClick, _2 = i2.onMouseEnter, J2 = i2.onMouseLeave, K2 = i2.toggleSerie, Q2 = i2.effects, U2 = useState({}), Z2 = U2[0], $2 = U2[1], tt2 = zt(), et2 = useCallback(function(t2) {
    if (Q2) {
      var e3 = Q2.filter(function(t3) {
        return "hover" === t3.on;
      }).reduce(function(t3, e4) {
        return p({}, t3, e4.style);
      }, {});
      $2(e3);
    }
    null == _2 || _2(z2, t2);
  }, [_2, z2, Q2]), it2 = useCallback(function(t2) {
    if (Q2) {
      var e3 = Q2.filter(function(t3) {
        return "hover" !== t3.on;
      }).reduce(function(t3, e4) {
        return p({}, t3, e4.style);
      }, {});
      $2(e3);
    }
    null == J2 || J2(z2, t2);
  }, [J2, z2, Q2]), nt2 = S({ direction: X2, justify: O2, symbolSize: null != (n2 = Z2.symbolSize) ? n2 : P2, symbolSpacing: R, width: A2, height: W2 }), ot = nt2.symbolX, rt2 = nt2.symbolY, lt2 = nt2.labelX, at = nt2.labelY, ct = nt2.labelAnchor, dt = nt2.labelAlignment, st = [N2, _2, J2, K2].some(function(t2) {
    return void 0 !== t2;
  }), ht2 = "function" == typeof F2 ? F2 : w$2[F2];
  return jsxs("g", { transform: "translate(" + x2 + "," + b2 + ")", style: { opacity: null != (l2 = Z2.itemOpacity) ? l2 : L2 }, children: [jsx("rect", { width: A2, height: W2, fill: null != (a2 = Z2.itemBackground) ? a2 : E2, style: { cursor: st ? "pointer" : "auto" }, onClick: function(t2) {
    null == N2 || N2(z2, t2), null == K2 || K2(z2.id);
  }, onMouseEnter: et2, onMouseLeave: it2 }), React.createElement(ht2, p({ id: z2.id, x: ot, y: rt2, size: null != (d = Z2.symbolSize) ? d : P2, fill: null != (g2 = null != (f2 = z2.fill) ? f2 : z2.color) ? g2 : "black", borderWidth: null != (m2 = Z2.symbolBorderWidth) ? m2 : q2, borderColor: null != (v2 = Z2.symbolBorderColor) ? v2 : I2 }, z2.hidden ? tt2.legends.hidden.symbol : void 0)), jsx("text", { textAnchor: ct, style: p({}, Mt(tt2.legends.text), { fill: null != (u2 = null != (y2 = null != (k2 = Z2.itemTextColor) ? k2 : B2) ? y2 : tt2.legends.text.fill) ? u2 : "black", dominantBaseline: dt, pointerEvents: "none", userSelect: "none" }, z2.hidden ? tt2.legends.hidden.text : void 0), x: lt2, y: at, children: z2.label })] });
}, Y = function(e3) {
  var i2 = e3.data, n2 = e3.x, o2 = e3.y, r2 = e3.direction, l2 = e3.padding, a2 = void 0 === l2 ? 0 : l2, c2 = e3.justify, d = e3.effects, s = e3.itemWidth, h = e3.itemHeight, g2 = e3.itemDirection, f2 = void 0 === g2 ? "left-to-right" : g2, m2 = e3.itemsSpacing, v2 = void 0 === m2 ? 0 : m2, u2 = e3.itemTextColor, p2 = e3.itemBackground, y2 = void 0 === p2 ? "transparent" : p2, k2 = e3.itemOpacity, b2 = void 0 === k2 ? 1 : k2, S2 = e3.symbolShape, A2 = e3.symbolSize, W2 = e3.symbolSpacing, z2 = e3.symbolBorderWidth, C2 = e3.symbolBorderColor, w2 = e3.onClick, Y2 = e3.onMouseEnter, O2 = e3.onMouseLeave, B2 = e3.toggleSerie, H2 = x$2({ itemCount: i2.length, itemWidth: s, itemHeight: h, itemsSpacing: v2, direction: r2, padding: a2 }).padding, E2 = "row" === r2 ? s + v2 : 0, j2 = "column" === r2 ? h + v2 : 0;
  return jsx("g", { transform: "translate(" + n2 + "," + o2 + ")", children: i2.map(function(e4, i3) {
    return jsx(X, { data: e4, x: i3 * E2 + H2.left, y: i3 * j2 + H2.top, width: s, height: h, direction: f2, justify: c2, effects: d, textColor: u2, background: y2, opacity: b2, symbolShape: S2, symbolSize: A2, symbolSpacing: W2, symbolBorderWidth: z2, symbolBorderColor: C2, onClick: w2, onMouseEnter: Y2, onMouseLeave: O2, toggleSerie: B2 }, i3);
  }) });
}, O = function(e3) {
  var i2 = e3.data, n2 = e3.containerWidth, o2 = e3.containerHeight, r2 = e3.translateX, l2 = void 0 === r2 ? 0 : r2, a2 = e3.translateY, c2 = void 0 === a2 ? 0 : a2, d = e3.anchor, s = e3.direction, h = e3.padding, g2 = void 0 === h ? 0 : h, f2 = e3.justify, m2 = e3.itemsSpacing, v2 = void 0 === m2 ? 0 : m2, u2 = e3.itemWidth, p2 = e3.itemHeight, y2 = e3.itemDirection, k2 = e3.itemTextColor, S2 = e3.itemBackground, A2 = e3.itemOpacity, W2 = e3.symbolShape, z2 = e3.symbolSize, C2 = e3.symbolSpacing, w2 = e3.symbolBorderWidth, X2 = e3.symbolBorderColor, O2 = e3.onClick, B2 = e3.onMouseEnter, H2 = e3.onMouseLeave, E2 = e3.toggleSerie, j2 = e3.effects, L2 = x$2({ itemCount: i2.length, itemsSpacing: v2, itemWidth: u2, itemHeight: p2, direction: s, padding: g2 }), M2 = L2.width, F2 = L2.height, T2 = b$2({ anchor: d, translateX: l2, translateY: c2, containerWidth: n2, containerHeight: o2, width: M2, height: F2 }), P2 = T2.x, V2 = T2.y;
  return jsx(Y, { data: i2, x: P2, y: V2, direction: s, padding: g2, justify: f2, effects: j2, itemsSpacing: v2, itemWidth: u2, itemHeight: p2, itemDirection: y2, itemTextColor: k2, itemBackground: S2, itemOpacity: A2, symbolShape: W2, symbolSize: z2, symbolSpacing: C2, symbolBorderWidth: w2, symbolBorderColor: X2, onClick: O2, onMouseEnter: B2, onMouseLeave: H2, toggleSerie: "boolean" == typeof E2 ? void 0 : E2 });
}, B = { start: "left", middle: "center", end: "right" }, H$1 = function(t2, e3) {
  var i2 = e3.data, n2 = e3.containerWidth, o2 = e3.containerHeight, r2 = e3.translateX, l2 = void 0 === r2 ? 0 : r2, a2 = e3.translateY, c2 = void 0 === a2 ? 0 : a2, d = e3.anchor, s = e3.direction, h = e3.padding, g2 = void 0 === h ? 0 : h, f2 = e3.justify, m2 = void 0 !== f2 && f2, v2 = e3.itemsSpacing, u2 = void 0 === v2 ? 0 : v2, p2 = e3.itemWidth, y2 = e3.itemHeight, k2 = e3.itemDirection, A2 = void 0 === k2 ? "left-to-right" : k2, W2 = e3.itemTextColor, z2 = e3.symbolSize, C2 = void 0 === z2 ? 16 : z2, w2 = e3.symbolSpacing, X2 = void 0 === w2 ? 8 : w2, Y2 = e3.theme, O2 = x$2({ itemCount: i2.length, itemWidth: p2, itemHeight: y2, itemsSpacing: u2, direction: s, padding: g2 }), H2 = O2.width, E2 = O2.height, j2 = O2.padding, L2 = b$2({ anchor: d, translateX: l2, translateY: c2, containerWidth: n2, containerHeight: o2, width: H2, height: E2 }), M2 = L2.x, F2 = L2.y, T2 = "row" === s ? p2 + u2 : 0, P2 = "column" === s ? y2 + u2 : 0;
  t2.save(), t2.translate(M2, F2), t2.font = Y2.legends.text.fontSize + "px " + (Y2.legends.text.fontFamily || "sans-serif"), i2.forEach(function(e4, i3) {
    var n3, o3, r3 = i3 * T2 + j2.left, l3 = i3 * P2 + j2.top, a3 = S({ direction: A2, justify: m2, symbolSize: C2, symbolSpacing: X2, width: p2, height: y2 }), c3 = a3.symbolX, d2 = a3.symbolY, s2 = a3.labelX, h2 = a3.labelY, g3 = a3.labelAnchor, f3 = a3.labelAlignment;
    t2.fillStyle = null != (n3 = e4.color) ? n3 : "black", t2.fillRect(r3 + c3, l3 + d2, C2, C2), t2.textAlign = B[g3], "central" === f3 && (t2.textBaseline = "middle"), t2.fillStyle = null != (o3 = null != W2 ? W2 : Y2.legends.text.fill) ? o3 : "black", t2.fillText(String(e4.label), r3 + s2, l3 + h2);
  }), t2.restore();
};
function v$1() {
  return v$1 = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var o2 = arguments[i2];
      for (var n2 in o2) Object.prototype.hasOwnProperty.call(o2, n2) && (t2[n2] = o2[n2]);
    }
    return t2;
  }, v$1.apply(this, arguments);
}
var x$1 = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 }, m$1 = function(t2, i2) {
  return "translate(" + t2 + "px, " + i2 + "px)";
}, b$1 = memo(function(t2) {
  var o2, n2 = t2.position, r2 = t2.anchor, e3 = t2.children, l2 = zt(), d = Ur(), y2 = d.animate, f2 = d.config, b2 = kt(), g2 = b2[0], w2 = b2[1], T2 = useRef(false), C2 = void 0, E2 = false, P2 = w2.width > 0 && w2.height > 0, j2 = Math.round(n2[0]), N2 = Math.round(n2[1]);
  P2 && ("top" === r2 ? (j2 -= w2.width / 2, N2 -= w2.height + 14) : "right" === r2 ? (j2 += 14, N2 -= w2.height / 2) : "bottom" === r2 ? (j2 -= w2.width / 2, N2 += 14) : "left" === r2 ? (j2 -= w2.width + 14, N2 -= w2.height / 2) : "center" === r2 && (j2 -= w2.width / 2, N2 -= w2.height / 2), C2 = { transform: m$1(j2, N2) }, T2.current || (E2 = true), T2.current = [j2, N2]);
  var O2 = useSpring({ to: C2, config: f2, immediate: !y2 || E2 }), V2 = v$1({}, x$1, l2.tooltip.wrapper, { transform: null != (o2 = O2.transform) ? o2 : m$1(j2, N2), opacity: O2.transform ? 1 : 0 });
  return jsx(animated.div, { ref: g2, style: V2, children: e3 });
});
b$1.displayName = "TooltipWrapper";
var g$1 = memo(function(t2) {
  var i2 = t2.size, o2 = void 0 === i2 ? 12 : i2, n2 = t2.color, r2 = t2.style;
  return jsx("span", { style: v$1({ display: "block", width: o2, height: o2, background: n2 }, void 0 === r2 ? {} : r2) });
}), w$1 = memo(function(t2) {
  var i2, o2 = t2.id, n2 = t2.value, r2 = t2.format, e3 = t2.enableChip, l2 = void 0 !== e3 && e3, a2 = t2.color, c2 = t2.renderContent, h = zt(), u2 = Ot(r2);
  if ("function" == typeof c2) i2 = c2();
  else {
    var f2 = n2;
    void 0 !== u2 && void 0 !== f2 && (f2 = u2(f2)), i2 = jsxs("div", { style: h.tooltip.basic, children: [l2 && jsx(g$1, { color: a2, style: h.tooltip.chip }), void 0 !== f2 ? jsxs("span", { children: [o2, ": ", jsx("strong", { children: "" + f2 })] }) : o2] });
  }
  return jsx("div", { style: h.tooltip.container, children: i2 });
}), T$2 = { width: "100%", borderCollapse: "collapse" }, C$2 = memo(function(t2) {
  var i2, o2 = t2.title, n2 = t2.rows, r2 = void 0 === n2 ? [] : n2, e3 = t2.renderContent, l2 = zt();
  return r2.length ? (i2 = "function" == typeof e3 ? e3() : jsxs("div", { children: [o2 && o2, jsx("table", { style: v$1({}, T$2, l2.tooltip.table), children: jsx("tbody", { children: r2.map(function(t3, i3) {
    return jsx("tr", { children: t3.map(function(t4, i4) {
      return jsx("td", { style: l2.tooltip.tableCell, children: t4 }, i4);
    }) }, i3);
  }) }) })] }), jsx("div", { style: l2.tooltip.container, children: i2 })) : null;
});
C$2.displayName = "TableTooltip";
var E$2 = memo(function(t2) {
  var i2 = t2.x0, n2 = t2.x1, r2 = t2.y0, e3 = t2.y1, l2 = zt(), u2 = Ur(), d = u2.animate, y2 = u2.config, f2 = useMemo(function() {
    return v$1({}, l2.crosshair.line, { pointerEvents: "none" });
  }, [l2.crosshair.line]), x2 = useSpring({ x1: i2, x2: n2, y1: r2, y2: e3, config: y2, immediate: !d });
  return jsx(animated.line, v$1({}, x2, { fill: "none", style: f2 }));
});
E$2.displayName = "CrosshairLine";
var P$2 = memo(function(t2) {
  var i2, o2, n2 = t2.width, r2 = t2.height, e3 = t2.type, l2 = t2.x, a2 = t2.y;
  return "cross" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: r2 }, o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }) : "top-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "top" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: a2 } : "top-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "right" === e3 ? o2 = { x0: l2, x1: n2, y0: a2, y1: a2 } : "bottom-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "bottom" === e3 ? i2 = { x0: l2, x1: l2, y0: a2, y1: r2 } : "bottom-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "left" === e3 ? o2 = { x0: 0, x1: l2, y0: a2, y1: a2 } : "x" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: r2 } : "y" === e3 && (o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }), jsxs(Fragment, { children: [i2 && jsx(E$2, { x0: i2.x0, x1: i2.x1, y0: i2.y0, y1: i2.y1 }), o2 && jsx(E$2, { x0: o2.x0, x1: o2.x1, y0: o2.y0, y1: o2.y1 })] });
});
P$2.displayName = "Crosshair";
var j$1 = createContext({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} }), N$1 = { isVisible: false, position: [null, null], content: null, anchor: null };
createContext(N$1);
var k$1 = function() {
  var t2 = useContext(j$1);
  if (void 0 === t2) throw new Error("useTooltip must be used within a TooltipProvider");
  return t2;
};
const epsilon = 1e-6;
class Path2 {
  constructor() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null;
    this._ = "";
  }
  moveTo(x2, y2) {
    this._ += `M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  }
  lineTo(x2, y2) {
    this._ += `L${this._x1 = +x2},${this._y1 = +y2}`;
  }
  arc(x2, y2, r2) {
    x2 = +x2, y2 = +y2, r2 = +r2;
    const x0 = x2 + r2;
    const y0 = y2;
    if (r2 < 0) throw new Error("negative radius");
    if (this._x1 === null) this._ += `M${x0},${y0}`;
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) this._ += "L" + x0 + "," + y0;
    if (!r2) return;
    this._ += `A${r2},${r2},0,1,1,${x2 - r2},${y2}A${r2},${r2},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
  }
  rect(x2, y2, w2, h) {
    this._ += `M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}h${+w2}v${+h}h${-w2}Z`;
  }
  value() {
    return this._ || null;
  }
}
class Polygon {
  constructor() {
    this._ = [];
  }
  moveTo(x2, y2) {
    this._.push([x2, y2]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(x2, y2) {
    this._.push([x2, y2]);
  }
  value() {
    return this._.length ? this._ : null;
  }
}
class Voronoi {
  constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
    if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
    this.delaunay = delaunay;
    this._circumcenters = new Float64Array(delaunay.points.length * 2);
    this.vectors = new Float64Array(delaunay.points.length * 2);
    this.xmax = xmax, this.xmin = xmin;
    this.ymax = ymax, this.ymin = ymin;
    this._init();
  }
  update() {
    this.delaunay.update();
    this._init();
    return this;
  }
  _init() {
    const { delaunay: { points, hull, triangles }, vectors } = this;
    let bx, by;
    const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
    for (let i2 = 0, j2 = 0, n2 = triangles.length, x2, y2; i2 < n2; i2 += 3, j2 += 2) {
      const t12 = triangles[i2] * 2;
      const t2 = triangles[i2 + 1] * 2;
      const t3 = triangles[i2 + 2] * 2;
      const x12 = points[t12];
      const y12 = points[t12 + 1];
      const x22 = points[t2];
      const y22 = points[t2 + 1];
      const x3 = points[t3];
      const y3 = points[t3 + 1];
      const dx = x22 - x12;
      const dy = y22 - y12;
      const ex = x3 - x12;
      const ey = y3 - y12;
      const ab = (dx * ey - dy * ex) * 2;
      if (Math.abs(ab) < 1e-9) {
        if (bx === void 0) {
          bx = by = 0;
          for (const i3 of hull) bx += points[i3 * 2], by += points[i3 * 2 + 1];
          bx /= hull.length, by /= hull.length;
        }
        const a2 = 1e9 * Math.sign((bx - x12) * ey - (by - y12) * ex);
        x2 = (x12 + x3) / 2 - a2 * ey;
        y2 = (y12 + y3) / 2 + a2 * ex;
      } else {
        const d = 1 / ab;
        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        x2 = x12 + (ey * bl - dy * cl) * d;
        y2 = y12 + (dx * cl - ex * bl) * d;
      }
      circumcenters[j2] = x2;
      circumcenters[j2 + 1] = y2;
    }
    let h = hull[hull.length - 1];
    let p0, p1 = h * 4;
    let x0, x1 = points[2 * h];
    let y0, y1 = points[2 * h + 1];
    vectors.fill(0);
    for (let i2 = 0; i2 < hull.length; ++i2) {
      h = hull[i2];
      p0 = p1, x0 = x1, y0 = y1;
      p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
      vectors[p0 + 2] = vectors[p1] = y0 - y1;
      vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
    }
  }
  render(context) {
    const buffer = context == null ? context = new Path2() : void 0;
    const { delaunay: { halfedges, inedges, hull }, circumcenters, vectors } = this;
    if (hull.length <= 1) return null;
    for (let i2 = 0, n2 = halfedges.length; i2 < n2; ++i2) {
      const j2 = halfedges[i2];
      if (j2 < i2) continue;
      const ti = Math.floor(i2 / 3) * 2;
      const tj = Math.floor(j2 / 3) * 2;
      const xi = circumcenters[ti];
      const yi = circumcenters[ti + 1];
      const xj = circumcenters[tj];
      const yj = circumcenters[tj + 1];
      this._renderSegment(xi, yi, xj, yj, context);
    }
    let h0, h1 = hull[hull.length - 1];
    for (let i2 = 0; i2 < hull.length; ++i2) {
      h0 = h1, h1 = hull[i2];
      const t2 = Math.floor(inedges[h1] / 3) * 2;
      const x2 = circumcenters[t2];
      const y2 = circumcenters[t2 + 1];
      const v2 = h0 * 4;
      const p2 = this._project(x2, y2, vectors[v2 + 2], vectors[v2 + 3]);
      if (p2) this._renderSegment(x2, y2, p2[0], p2[1], context);
    }
    return buffer && buffer.value();
  }
  renderBounds(context) {
    const buffer = context == null ? context = new Path2() : void 0;
    context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    return buffer && buffer.value();
  }
  renderCell(i2, context) {
    const buffer = context == null ? context = new Path2() : void 0;
    const points = this._clip(i2);
    if (points === null || !points.length) return;
    context.moveTo(points[0], points[1]);
    let n2 = points.length;
    while (points[0] === points[n2 - 2] && points[1] === points[n2 - 1] && n2 > 1) n2 -= 2;
    for (let i3 = 2; i3 < n2; i3 += 2) {
      if (points[i3] !== points[i3 - 2] || points[i3 + 1] !== points[i3 - 1])
        context.lineTo(points[i3], points[i3 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  *cellPolygons() {
    const { delaunay: { points } } = this;
    for (let i2 = 0, n2 = points.length / 2; i2 < n2; ++i2) {
      const cell = this.cellPolygon(i2);
      if (cell) cell.index = i2, yield cell;
    }
  }
  cellPolygon(i2) {
    const polygon = new Polygon();
    this.renderCell(i2, polygon);
    return polygon.value();
  }
  _renderSegment(x0, y0, x1, y1, context) {
    let S2;
    const c0 = this._regioncode(x0, y0);
    const c1 = this._regioncode(x1, y1);
    if (c0 === 0 && c1 === 0) {
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
    } else if (S2 = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
      context.moveTo(S2[0], S2[1]);
      context.lineTo(S2[2], S2[3]);
    }
  }
  contains(i2, x2, y2) {
    if ((x2 = +x2, x2 !== x2) || (y2 = +y2, y2 !== y2)) return false;
    return this.delaunay._step(i2, x2, y2) === i2;
  }
  *neighbors(i2) {
    const ci = this._clip(i2);
    if (ci) for (const j2 of this.delaunay.neighbors(i2)) {
      const cj = this._clip(j2);
      if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
        for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
          if (ci[ai] === cj[aj] && ci[ai + 1] === cj[aj + 1] && ci[(ai + 2) % li] === cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] === cj[(aj + lj - 1) % lj]) {
            yield j2;
            break loop;
          }
        }
      }
    }
  }
  _cell(i2) {
    const { circumcenters, delaunay: { inedges, halfedges, triangles } } = this;
    const e0 = inedges[i2];
    if (e0 === -1) return null;
    const points = [];
    let e3 = e0;
    do {
      const t2 = Math.floor(e3 / 3);
      points.push(circumcenters[t2 * 2], circumcenters[t2 * 2 + 1]);
      e3 = e3 % 3 === 2 ? e3 - 2 : e3 + 1;
      if (triangles[e3] !== i2) break;
      e3 = halfedges[e3];
    } while (e3 !== e0 && e3 !== -1);
    return points;
  }
  _clip(i2) {
    if (i2 === 0 && this.delaunay.hull.length === 1) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    const points = this._cell(i2);
    if (points === null) return null;
    const { vectors: V2 } = this;
    const v2 = i2 * 4;
    return this._simplify(V2[v2] || V2[v2 + 1] ? this._clipInfinite(i2, points, V2[v2], V2[v2 + 1], V2[v2 + 2], V2[v2 + 3]) : this._clipFinite(i2, points));
  }
  _clipFinite(i2, points) {
    const n2 = points.length;
    let P2 = null;
    let x0, y0, x1 = points[n2 - 2], y1 = points[n2 - 1];
    let c0, c1 = this._regioncode(x1, y1);
    let e0, e1 = 0;
    for (let j2 = 0; j2 < n2; j2 += 2) {
      x0 = x1, y0 = y1, x1 = points[j2], y1 = points[j2 + 1];
      c0 = c1, c1 = this._regioncode(x1, y1);
      if (c0 === 0 && c1 === 0) {
        e0 = e1, e1 = 0;
        if (P2) P2.push(x1, y1);
        else P2 = [x1, y1];
      } else {
        let S2, sx0, sy0, sx1, sy1;
        if (c0 === 0) {
          if ((S2 = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
          [sx0, sy0, sx1, sy1] = S2;
        } else {
          if ((S2 = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
          [sx1, sy1, sx0, sy0] = S2;
          e0 = e1, e1 = this._edgecode(sx0, sy0);
          if (e0 && e1) this._edge(i2, e0, e1, P2, P2.length);
          if (P2) P2.push(sx0, sy0);
          else P2 = [sx0, sy0];
        }
        e0 = e1, e1 = this._edgecode(sx1, sy1);
        if (e0 && e1) this._edge(i2, e0, e1, P2, P2.length);
        if (P2) P2.push(sx1, sy1);
        else P2 = [sx1, sy1];
      }
    }
    if (P2) {
      e0 = e1, e1 = this._edgecode(P2[0], P2[1]);
      if (e0 && e1) this._edge(i2, e0, e1, P2, P2.length);
    } else if (this.contains(i2, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    return P2;
  }
  _clipSegment(x0, y0, x1, y1, c0, c1) {
    const flip = c0 < c1;
    if (flip) [x0, y0, x1, y1, c0, c1] = [x1, y1, x0, y0, c1, c0];
    while (true) {
      if (c0 === 0 && c1 === 0) return flip ? [x1, y1, x0, y0] : [x0, y0, x1, y1];
      if (c0 & c1) return null;
      let x2, y2, c2 = c0 || c1;
      if (c2 & 8) x2 = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y2 = this.ymax;
      else if (c2 & 4) x2 = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y2 = this.ymin;
      else if (c2 & 2) y2 = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x2 = this.xmax;
      else y2 = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x2 = this.xmin;
      if (c0) x0 = x2, y0 = y2, c0 = this._regioncode(x0, y0);
      else x1 = x2, y1 = y2, c1 = this._regioncode(x1, y1);
    }
  }
  _clipInfinite(i2, points, vx0, vy0, vxn, vyn) {
    let P2 = Array.from(points), p2;
    if (p2 = this._project(P2[0], P2[1], vx0, vy0)) P2.unshift(p2[0], p2[1]);
    if (p2 = this._project(P2[P2.length - 2], P2[P2.length - 1], vxn, vyn)) P2.push(p2[0], p2[1]);
    if (P2 = this._clipFinite(i2, P2)) {
      for (let j2 = 0, n2 = P2.length, c0, c1 = this._edgecode(P2[n2 - 2], P2[n2 - 1]); j2 < n2; j2 += 2) {
        c0 = c1, c1 = this._edgecode(P2[j2], P2[j2 + 1]);
        if (c0 && c1) j2 = this._edge(i2, c0, c1, P2, j2), n2 = P2.length;
      }
    } else if (this.contains(i2, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      P2 = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
    }
    return P2;
  }
  _edge(i2, e0, e1, P2, j2) {
    while (e0 !== e1) {
      let x2, y2;
      switch (e0) {
        case 5:
          e0 = 4;
          continue;
        case 4:
          e0 = 6, x2 = this.xmax, y2 = this.ymin;
          break;
        case 6:
          e0 = 2;
          continue;
        case 2:
          e0 = 10, x2 = this.xmax, y2 = this.ymax;
          break;
        case 10:
          e0 = 8;
          continue;
        case 8:
          e0 = 9, x2 = this.xmin, y2 = this.ymax;
          break;
        case 9:
          e0 = 1;
          continue;
        case 1:
          e0 = 5, x2 = this.xmin, y2 = this.ymin;
          break;
      }
      if ((P2[j2] !== x2 || P2[j2 + 1] !== y2) && this.contains(i2, x2, y2)) {
        P2.splice(j2, 0, x2, y2), j2 += 2;
      }
    }
    return j2;
  }
  _project(x0, y0, vx, vy) {
    let t2 = Infinity, c2, x2, y2;
    if (vy < 0) {
      if (y0 <= this.ymin) return null;
      if ((c2 = (this.ymin - y0) / vy) < t2) y2 = this.ymin, x2 = x0 + (t2 = c2) * vx;
    } else if (vy > 0) {
      if (y0 >= this.ymax) return null;
      if ((c2 = (this.ymax - y0) / vy) < t2) y2 = this.ymax, x2 = x0 + (t2 = c2) * vx;
    }
    if (vx > 0) {
      if (x0 >= this.xmax) return null;
      if ((c2 = (this.xmax - x0) / vx) < t2) x2 = this.xmax, y2 = y0 + (t2 = c2) * vy;
    } else if (vx < 0) {
      if (x0 <= this.xmin) return null;
      if ((c2 = (this.xmin - x0) / vx) < t2) x2 = this.xmin, y2 = y0 + (t2 = c2) * vy;
    }
    return [x2, y2];
  }
  _edgecode(x2, y2) {
    return (x2 === this.xmin ? 1 : x2 === this.xmax ? 2 : 0) | (y2 === this.ymin ? 4 : y2 === this.ymax ? 8 : 0);
  }
  _regioncode(x2, y2) {
    return (x2 < this.xmin ? 1 : x2 > this.xmax ? 2 : 0) | (y2 < this.ymin ? 4 : y2 > this.ymax ? 8 : 0);
  }
  _simplify(P2) {
    if (P2 && P2.length > 4) {
      for (let i2 = 0; i2 < P2.length; i2 += 2) {
        const j2 = (i2 + 2) % P2.length, k2 = (i2 + 4) % P2.length;
        if (P2[i2] === P2[j2] && P2[j2] === P2[k2] || P2[i2 + 1] === P2[j2 + 1] && P2[j2 + 1] === P2[k2 + 1]) {
          P2.splice(j2, 2), i2 -= 2;
        }
      }
      if (!P2.length) P2 = null;
    }
    return P2;
  }
}
const tau = 2 * Math.PI, pow = Math.pow;
function pointX(p2) {
  return p2[0];
}
function pointY(p2) {
  return p2[1];
}
function collinear(d) {
  const { triangles, coords } = d;
  for (let i2 = 0; i2 < triangles.length; i2 += 3) {
    const a2 = 2 * triangles[i2], b2 = 2 * triangles[i2 + 1], c2 = 2 * triangles[i2 + 2], cross = (coords[c2] - coords[a2]) * (coords[b2 + 1] - coords[a2 + 1]) - (coords[b2] - coords[a2]) * (coords[c2 + 1] - coords[a2 + 1]);
    if (cross > 1e-10) return false;
  }
  return true;
}
function jitter(x2, y2, r2) {
  return [x2 + Math.sin(x2 + y2) * r2, y2 + Math.cos(x2 - y2) * r2];
}
class Delaunay {
  static from(points, fx = pointX, fy = pointY, that) {
    return new Delaunay("length" in points ? flatArray(points, fx, fy, that) : Float64Array.from(flatIterable(points, fx, fy, that)));
  }
  constructor(points) {
    this._delaunator = new Delaunator(points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = this._delaunator.coords;
    this._init();
  }
  update() {
    this._delaunator.update();
    this._init();
    return this;
  }
  _init() {
    const d = this._delaunator, points = this.points;
    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from({ length: points.length / 2 }, (_2, i2) => i2).sort((i2, j2) => points[2 * i2] - points[2 * j2] || points[2 * i2 + 1] - points[2 * j2 + 1]);
      const e3 = this.collinear[0], f2 = this.collinear[this.collinear.length - 1], bounds = [points[2 * e3], points[2 * e3 + 1], points[2 * f2], points[2 * f2 + 1]], r2 = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
      for (let i2 = 0, n2 = points.length / 2; i2 < n2; ++i2) {
        const p2 = jitter(points[2 * i2], points[2 * i2 + 1], r2);
        points[2 * i2] = p2[0];
        points[2 * i2 + 1] = p2[1];
      }
      this._delaunator = new Delaunator(points);
    } else {
      delete this.collinear;
    }
    const halfedges = this.halfedges = this._delaunator.halfedges;
    const hull = this.hull = this._delaunator.hull;
    const triangles = this.triangles = this._delaunator.triangles;
    const inedges = this.inedges.fill(-1);
    const hullIndex = this._hullIndex.fill(-1);
    for (let e3 = 0, n2 = halfedges.length; e3 < n2; ++e3) {
      const p2 = triangles[e3 % 3 === 2 ? e3 - 2 : e3 + 1];
      if (halfedges[e3] === -1 || inedges[p2] === -1) inedges[p2] = e3;
    }
    for (let i2 = 0, n2 = hull.length; i2 < n2; ++i2) {
      hullIndex[hull[i2]] = i2;
    }
    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      inedges[hull[0]] = 1;
      if (hull.length === 2) {
        inedges[hull[1]] = 0;
        this.triangles[1] = hull[1];
        this.triangles[2] = hull[1];
      }
    }
  }
  voronoi(bounds) {
    return new Voronoi(this, bounds);
  }
  *neighbors(i2) {
    const { inedges, hull, _hullIndex, halfedges, triangles, collinear: collinear2 } = this;
    if (collinear2) {
      const l2 = collinear2.indexOf(i2);
      if (l2 > 0) yield collinear2[l2 - 1];
      if (l2 < collinear2.length - 1) yield collinear2[l2 + 1];
      return;
    }
    const e0 = inedges[i2];
    if (e0 === -1) return;
    let e3 = e0, p0 = -1;
    do {
      yield p0 = triangles[e3];
      e3 = e3 % 3 === 2 ? e3 - 2 : e3 + 1;
      if (triangles[e3] !== i2) return;
      e3 = halfedges[e3];
      if (e3 === -1) {
        const p2 = hull[(_hullIndex[i2] + 1) % hull.length];
        if (p2 !== p0) yield p2;
        return;
      }
    } while (e3 !== e0);
  }
  find(x2, y2, i2 = 0) {
    if ((x2 = +x2, x2 !== x2) || (y2 = +y2, y2 !== y2)) return -1;
    const i0 = i2;
    let c2;
    while ((c2 = this._step(i2, x2, y2)) >= 0 && c2 !== i2 && c2 !== i0) i2 = c2;
    return c2;
  }
  _step(i2, x2, y2) {
    const { inedges, hull, _hullIndex, halfedges, triangles, points } = this;
    if (inedges[i2] === -1 || !points.length) return (i2 + 1) % (points.length >> 1);
    let c2 = i2;
    let dc = pow(x2 - points[i2 * 2], 2) + pow(y2 - points[i2 * 2 + 1], 2);
    const e0 = inedges[i2];
    let e3 = e0;
    do {
      let t2 = triangles[e3];
      const dt = pow(x2 - points[t2 * 2], 2) + pow(y2 - points[t2 * 2 + 1], 2);
      if (dt < dc) dc = dt, c2 = t2;
      e3 = e3 % 3 === 2 ? e3 - 2 : e3 + 1;
      if (triangles[e3] !== i2) break;
      e3 = halfedges[e3];
      if (e3 === -1) {
        e3 = hull[(_hullIndex[i2] + 1) % hull.length];
        if (e3 !== t2) {
          if (pow(x2 - points[e3 * 2], 2) + pow(y2 - points[e3 * 2 + 1], 2) < dc) return e3;
        }
        break;
      }
    } while (e3 !== e0);
    return c2;
  }
  render(context) {
    const buffer = context == null ? context = new Path2() : void 0;
    const { points, halfedges, triangles } = this;
    for (let i2 = 0, n2 = halfedges.length; i2 < n2; ++i2) {
      const j2 = halfedges[i2];
      if (j2 < i2) continue;
      const ti = triangles[i2] * 2;
      const tj = triangles[j2] * 2;
      context.moveTo(points[ti], points[ti + 1]);
      context.lineTo(points[tj], points[tj + 1]);
    }
    this.renderHull(context);
    return buffer && buffer.value();
  }
  renderPoints(context, r2) {
    if (r2 === void 0 && (!context || typeof context.moveTo !== "function")) r2 = context, context = null;
    r2 = r2 == void 0 ? 2 : +r2;
    const buffer = context == null ? context = new Path2() : void 0;
    const { points } = this;
    for (let i2 = 0, n2 = points.length; i2 < n2; i2 += 2) {
      const x2 = points[i2], y2 = points[i2 + 1];
      context.moveTo(x2 + r2, y2);
      context.arc(x2, y2, r2, 0, tau);
    }
    return buffer && buffer.value();
  }
  renderHull(context) {
    const buffer = context == null ? context = new Path2() : void 0;
    const { hull, points } = this;
    const h = hull[0] * 2, n2 = hull.length;
    context.moveTo(points[h], points[h + 1]);
    for (let i2 = 1; i2 < n2; ++i2) {
      const h2 = 2 * hull[i2];
      context.lineTo(points[h2], points[h2 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  hullPolygon() {
    const polygon = new Polygon();
    this.renderHull(polygon);
    return polygon.value();
  }
  renderTriangle(i2, context) {
    const buffer = context == null ? context = new Path2() : void 0;
    const { points, triangles } = this;
    const t02 = triangles[i2 *= 3] * 2;
    const t12 = triangles[i2 + 1] * 2;
    const t2 = triangles[i2 + 2] * 2;
    context.moveTo(points[t02], points[t02 + 1]);
    context.lineTo(points[t12], points[t12 + 1]);
    context.lineTo(points[t2], points[t2 + 1]);
    context.closePath();
    return buffer && buffer.value();
  }
  *trianglePolygons() {
    const { triangles } = this;
    for (let i2 = 0, n2 = triangles.length / 3; i2 < n2; ++i2) {
      yield this.trianglePolygon(i2);
    }
  }
  trianglePolygon(i2) {
    const polygon = new Polygon();
    this.renderTriangle(i2, polygon);
    return polygon.value();
  }
}
function flatArray(points, fx, fy, that) {
  const n2 = points.length;
  const array2 = new Float64Array(n2 * 2);
  for (let i2 = 0; i2 < n2; ++i2) {
    const p2 = points[i2];
    array2[i2 * 2] = fx.call(that, p2, i2, points);
    array2[i2 * 2 + 1] = fy.call(that, p2, i2, points);
  }
  return array2;
}
function* flatIterable(points, fx, fy, that) {
  let i2 = 0;
  for (const p2 of points) {
    yield fx.call(that, p2, i2, points);
    yield fy.call(that, p2, i2, points);
    ++i2;
  }
}
function v() {
  return v = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var o2 = arguments[i2];
      for (var n2 in o2) Object.prototype.hasOwnProperty.call(o2, n2) && (t2[n2] = o2[n2]);
    }
    return t2;
  }, v.apply(this, arguments);
}
var x = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 }, m = function(t2, i2) {
  return "translate(" + t2 + "px, " + i2 + "px)";
}, b = memo(function(t2) {
  var o2, n2 = t2.position, r2 = t2.anchor, e3 = t2.children, l2 = zt(), d = Ur(), y2 = d.animate, f2 = d.config, b2 = kt(), g2 = b2[0], w2 = b2[1], T2 = useRef(false), C2 = void 0, E2 = false, P2 = w2.width > 0 && w2.height > 0, j2 = Math.round(n2[0]), N2 = Math.round(n2[1]);
  P2 && ("top" === r2 ? (j2 -= w2.width / 2, N2 -= w2.height + 14) : "right" === r2 ? (j2 += 14, N2 -= w2.height / 2) : "bottom" === r2 ? (j2 -= w2.width / 2, N2 += 14) : "left" === r2 ? (j2 -= w2.width + 14, N2 -= w2.height / 2) : "center" === r2 && (j2 -= w2.width / 2, N2 -= w2.height / 2), C2 = { transform: m(j2, N2) }, T2.current || (E2 = true), T2.current = [j2, N2]);
  var O2 = useSpring({ to: C2, config: f2, immediate: !y2 || E2 }), V2 = v({}, x, l2.tooltip.wrapper, { transform: null != (o2 = O2.transform) ? o2 : m(j2, N2), opacity: O2.transform ? 1 : 0 });
  return jsx(animated.div, { ref: g2, style: V2, children: e3 });
});
b.displayName = "TooltipWrapper";
var g = memo(function(t2) {
  var i2 = t2.size, o2 = void 0 === i2 ? 12 : i2, n2 = t2.color, r2 = t2.style;
  return jsx("span", { style: v({ display: "block", width: o2, height: o2, background: n2 }, void 0 === r2 ? {} : r2) });
});
memo(function(t2) {
  var i2, o2 = t2.id, n2 = t2.value, r2 = t2.format, e3 = t2.enableChip, l2 = void 0 !== e3 && e3, a2 = t2.color, c2 = t2.renderContent, h = zt(), u2 = Ot(r2);
  if ("function" == typeof c2) i2 = c2();
  else {
    var f2 = n2;
    void 0 !== u2 && void 0 !== f2 && (f2 = u2(f2)), i2 = jsxs("div", { style: h.tooltip.basic, children: [l2 && jsx(g, { color: a2, style: h.tooltip.chip }), void 0 !== f2 ? jsxs("span", { children: [o2, ": ", jsx("strong", { children: "" + f2 })] }) : o2] });
  }
  return jsx("div", { style: h.tooltip.container, children: i2 });
});
var T$1 = { width: "100%", borderCollapse: "collapse" }, C$1 = memo(function(t2) {
  var i2, o2 = t2.title, n2 = t2.rows, r2 = void 0 === n2 ? [] : n2, e3 = t2.renderContent, l2 = zt();
  return r2.length ? (i2 = "function" == typeof e3 ? e3() : jsxs("div", { children: [o2 && o2, jsx("table", { style: v({}, T$1, l2.tooltip.table), children: jsx("tbody", { children: r2.map(function(t3, i3) {
    return jsx("tr", { children: t3.map(function(t4, i4) {
      return jsx("td", { style: l2.tooltip.tableCell, children: t4 }, i4);
    }) }, i3);
  }) }) })] }), jsx("div", { style: l2.tooltip.container, children: i2 })) : null;
});
C$1.displayName = "TableTooltip";
var E$1 = memo(function(t2) {
  var i2 = t2.x0, n2 = t2.x1, r2 = t2.y0, e3 = t2.y1, l2 = zt(), u2 = Ur(), d = u2.animate, y2 = u2.config, f2 = useMemo(function() {
    return v({}, l2.crosshair.line, { pointerEvents: "none" });
  }, [l2.crosshair.line]), x2 = useSpring({ x1: i2, x2: n2, y1: r2, y2: e3, config: y2, immediate: !d });
  return jsx(animated.line, v({}, x2, { fill: "none", style: f2 }));
});
E$1.displayName = "CrosshairLine";
var P$1 = memo(function(t2) {
  var i2, o2, n2 = t2.width, r2 = t2.height, e3 = t2.type, l2 = t2.x, a2 = t2.y;
  return "cross" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: r2 }, o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }) : "top-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "top" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: a2 } : "top-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: 0, y1: a2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "right" === e3 ? o2 = { x0: l2, x1: n2, y0: a2, y1: a2 } : "bottom-right" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: l2, x1: n2, y0: a2, y1: a2 }) : "bottom" === e3 ? i2 = { x0: l2, x1: l2, y0: a2, y1: r2 } : "bottom-left" === e3 ? (i2 = { x0: l2, x1: l2, y0: a2, y1: r2 }, o2 = { x0: 0, x1: l2, y0: a2, y1: a2 }) : "left" === e3 ? o2 = { x0: 0, x1: l2, y0: a2, y1: a2 } : "x" === e3 ? i2 = { x0: l2, x1: l2, y0: 0, y1: r2 } : "y" === e3 && (o2 = { x0: 0, x1: n2, y0: a2, y1: a2 }), jsxs(Fragment, { children: [i2 && jsx(E$1, { x0: i2.x0, x1: i2.x1, y0: i2.y0, y1: i2.y1 }), o2 && jsx(E$1, { x0: o2.x0, x1: o2.x1, y0: o2.y0, y1: o2.y1 })] });
});
P$1.displayName = "Crosshair";
var j = createContext({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} }), N = { isVisible: false, position: [null, null], content: null, anchor: null };
createContext(N);
var k = function() {
  var t2 = useContext(j);
  if (void 0 === t2) throw new Error("useTooltip must be used within a TooltipProvider");
  return t2;
};
var C = function(n2) {
  return [n2.x, n2.y];
}, L = _t, T = "cursor", P = "top", w = function(n2) {
  var o2 = n2.points, e3 = n2.getNodePosition, i2 = void 0 === e3 ? C : e3, t2 = n2.margin, r2 = void 0 === t2 ? L : t2;
  return o2.map(function(n3) {
    var o3 = i2(n3), e4 = o3[0], t3 = o3[1];
    return [e4 + r2.left, t3 + r2.top];
  });
}, E = function(n2) {
  var o2 = n2.points, e3 = n2.width, i2 = n2.height, t2 = n2.margin, r2 = void 0 === t2 ? L : t2, l2 = n2.debug, u2 = Delaunay.from(o2), a2 = l2 ? u2.voronoi([0, 0, r2.left + e3 + r2.right, r2.top + i2 + r2.bottom]) : void 0;
  return { points: o2, delaunay: u2, voronoi: a2 };
}, W = function(o2) {
  var e3 = o2.points, i2 = o2.getNodePosition, t2 = void 0 === i2 ? C : i2, r2 = o2.width, l2 = o2.height, u2 = o2.margin, a2 = void 0 === u2 ? L : u2, d = o2.debug;
  return useMemo(function() {
    return E({ points: w({ points: e3, margin: a2, getNodePosition: t2 }), width: r2, height: l2, margin: a2, debug: d });
  }, [e3, r2, l2, a2, d]);
}, D = function(r2) {
  var l2 = r2.elementRef, u2 = r2.nodes, s = r2.getNodePosition, c2 = void 0 === s ? C : s, h = r2.delaunay, v2 = r2.setCurrent, f2 = r2.margin, p2 = void 0 === f2 ? L : f2, m2 = r2.detectionRadius, M2 = void 0 === m2 ? 1 / 0 : m2, b2 = r2.isInteractive, k$12 = void 0 === b2 || b2, y2 = r2.onMouseEnter, w2 = r2.onMouseMove, E2 = r2.onMouseLeave, W2 = r2.onClick, x2 = r2.onTouchStart, S2 = r2.onTouchMove, D2 = r2.onTouchEnd, R = r2.enableTouchCrosshair, A2 = void 0 !== R && R, N2 = r2.tooltip, O2 = r2.tooltipPosition, j2 = void 0 === O2 ? T : O2, I2 = r2.tooltipAnchor, z2 = void 0 === I2 ? P : I2, F2 = useState(null), H2 = F2[0], B2 = F2[1], q2 = useRef(null);
  useEffect(function() {
    q2.current = H2;
  }, [q2, H2]);
  var G2 = useCallback(function(n2) {
    if (!l2.current) return null;
    var o2 = Sn(l2.current, n2), e3 = o2[0], i2 = o2[1], t2 = h.find(e3, i2), r3 = void 0 !== t2 ? u2[t2] : null;
    if (r3 && M2 !== 1 / 0) {
      var s2 = c2(r3), v3 = s2[0], f3 = s2[1];
      Mn(e3, i2, v3 + p2.left, f3 + p2.top) > M2 && (t2 = null, r3 = null);
    }
    return null === t2 || null === r3 ? null : [t2, r3];
  }, [l2, h, u2, c2, p2, M2]), J2 = k(), K2 = J2.showTooltipAt, Q2 = J2.showTooltipFromEvent, U2 = J2.hideTooltip, V2 = useMemo(function() {
    if (N2) return "cursor" === j2 ? function(n2, o2) {
      Q2(N2(n2), o2, z2);
    } : function(n2) {
      var o2 = c2(n2), e3 = o2[0], i2 = o2[1];
      K2(N2(n2), [e3 + p2.left, i2 + p2.top], z2);
    };
  }, [K2, Q2, N2, j2, z2, c2, p2]), X2 = useCallback(function(n2) {
    var o2 = G2(n2);
    if (B2(o2), null == v2 || v2(o2 ? o2[1] : null), o2) {
      var e3 = o2[1];
      null == V2 || V2(e3, n2), null == y2 || y2(o2[1], n2);
    }
  }, [G2, B2, v2, V2, y2]), Y2 = useCallback(function(n2) {
    var o2 = G2(n2);
    if (B2(o2), o2) {
      var e3 = o2[0], i2 = o2[1];
      if (null == v2 || v2(i2), null == V2 || V2(i2, n2), q2.current) {
        var t2 = q2.current, r3 = t2[0], l3 = t2[1];
        e3 !== r3 ? null == E2 || E2(l3, n2) : null == w2 || w2(i2, n2);
      } else null == y2 || y2(i2, n2);
    } else null == v2 || v2(null), null == U2 || U2(), q2.current && (null == E2 || E2(q2.current[1], n2));
  }, [G2, B2, q2, y2, w2, E2, V2, U2]), Z2 = useCallback(function(n2) {
    B2(null), null == v2 || v2(null), U2(), E2 && q2.current && E2(q2.current[1], n2);
  }, [B2, v2, q2, U2, E2]), $2 = useCallback(function(n2) {
    var o2 = G2(n2);
    B2(o2), o2 && (null == W2 || W2(o2[1], n2));
  }, [G2, B2, W2]), _2 = useCallback(function(n2) {
    var o2 = G2(n2);
    A2 && (B2(o2), null == v2 || v2(o2 ? o2[1] : null)), o2 && (null == x2 || x2(o2[1], n2));
  }, [G2, B2, v2, A2, x2]), nn2 = useCallback(function(n2) {
    var o2 = G2(n2);
    A2 && (B2(o2), null == v2 || v2(o2 ? o2[1] : null)), o2 && (null == S2 || S2(o2[1], n2));
  }, [G2, B2, v2, A2, S2]), on2 = useCallback(function(n2) {
    A2 && (B2(null), null == v2 || v2(null)), D2 && q2.current && D2(q2.current[1], n2);
  }, [A2, B2, v2, D2, q2]);
  return { current: H2, handleMouseEnter: k$12 ? X2 : void 0, handleMouseMove: k$12 ? Y2 : void 0, handleMouseLeave: k$12 ? Z2 : void 0, handleClick: k$12 ? $2 : void 0, handleTouchStart: k$12 ? _2 : void 0, handleTouchMove: k$12 ? nn2 : void 0, handleTouchEnd: k$12 ? on2 : void 0 };
}, I = function(o2) {
  var i2 = o2.nodes, t2 = o2.width, r2 = o2.height, l2 = o2.margin, u2 = void 0 === l2 ? L : l2, a2 = o2.getNodePosition, d = o2.setCurrent, s = o2.onMouseEnter, c2 = o2.onMouseMove, h = o2.onMouseLeave, v2 = o2.onClick, f2 = o2.onTouchStart, p2 = o2.onTouchMove, g2 = o2.onTouchEnd, k2 = o2.enableTouchCrosshair, y2 = void 0 !== k2 && k2, C2 = o2.detectionRadius, w2 = void 0 === C2 ? 1 / 0 : C2, E2 = o2.tooltip, x2 = o2.tooltipPosition, S2 = void 0 === x2 ? T : x2, R = o2.tooltipAnchor, A2 = void 0 === R ? P : R, N2 = o2.debug, O2 = useRef(null), j2 = W({ points: i2, getNodePosition: a2, width: t2, height: r2, margin: u2, debug: N2 }), I2 = j2.delaunay, z2 = j2.voronoi, F2 = D({ elementRef: O2, nodes: i2, delaunay: I2, margin: u2, detectionRadius: w2, setCurrent: d, onMouseEnter: s, onMouseMove: c2, onMouseLeave: h, onClick: v2, onTouchStart: f2, onTouchMove: p2, onTouchEnd: g2, enableTouchCrosshair: y2, tooltip: E2, tooltipPosition: S2, tooltipAnchor: A2 }), H2 = F2.current, B2 = F2.handleMouseEnter, q2 = F2.handleMouseMove, G2 = F2.handleMouseLeave, J2 = F2.handleClick, K2 = F2.handleTouchStart, Q2 = F2.handleTouchMove, U2 = F2.handleTouchEnd, V2 = useMemo(function() {
    if (N2 && z2) return z2.render();
  }, [N2, z2]);
  return jsxs("g", { ref: O2, transform: "translate(" + -u2.left + "," + -u2.top + ")", children: [N2 && z2 && jsxs(Fragment, { children: [jsx("path", { d: V2, stroke: "red", strokeWidth: 1, opacity: 0.75 }), w2 < 1 / 0 && jsx("path", { stroke: "red", strokeWidth: 0.35, fill: "none", d: I2.renderPoints(void 0, w2) }), H2 && jsx("path", { fill: "pink", opacity: 0.35, d: z2.renderCell(H2[0]) })] }), jsx("rect", { "data-ref": "mesh-interceptor", width: u2.left + t2 + u2.right, height: u2.top + r2 + u2.bottom, fill: "red", opacity: 0, style: { cursor: "auto" }, onMouseEnter: B2, onMouseMove: q2, onMouseLeave: G2, onTouchStart: K2, onTouchMove: Q2, onTouchEnd: U2, onClick: J2 })] });
}, z = function(n2, o2) {
  n2.save(), n2.globalAlpha = 0.75, n2.beginPath(), o2.render(n2), n2.strokeStyle = "red", n2.lineWidth = 1, n2.stroke(), n2.restore();
}, H = function(n2, o2, e3) {
  n2.save(), n2.globalAlpha = 0.35, n2.beginPath(), o2.renderCell(e3, n2), n2.fillStyle = "pink", n2.fill(), n2.restore();
};
function Q() {
  return Q = Object.assign ? Object.assign.bind() : function(e3) {
    for (var o2 = 1; o2 < arguments.length; o2++) {
      var i2 = arguments[o2];
      for (var t2 in i2) Object.prototype.hasOwnProperty.call(i2, t2) && (e3[t2] = i2[t2]);
    }
    return e3;
  }, Q.apply(this, arguments);
}
var U = memo(function(e3) {
  var o2 = e3.point;
  return jsx(w$1, { id: jsxs("span", { children: ["x: ", jsx("strong", { children: o2.data.xFormatted }), ", y:", " ", jsx("strong", { children: o2.data.yFormatted })] }), enableChip: true, color: o2.serieColor });
}), Z = memo(function(e3) {
  var o2 = e3.slice, i2 = e3.axis, t2 = zt(), n2 = "x" === i2 ? "y" : "x";
  return jsx(C$2, { rows: o2.points.map(function(e4) {
    return [jsx(g$1, { color: e4.serieColor, style: t2.tooltip.chip }, "chip"), e4.serieId, jsx("span", { style: t2.tooltip.tableCellValue, children: e4.data[n2 + "Formatted"] }, "value")];
  }) });
}), $ = { curve: "linear", xScale: { type: "point" }, yScale: { type: "linear", min: 0, max: "auto" }, layers: ["grid", "markers", "axes", "areas", "crosshair", "lines", "points", "slices", "mesh", "legends"], axisBottom: {}, axisLeft: {}, enableGridX: true, enableGridY: true, enablePoints: true, pointSize: 6, pointColor: { from: "color" }, pointBorderWidth: 0, pointBorderColor: { theme: "background" }, enablePointLabel: false, pointLabel: "yFormatted", colors: { scheme: "nivo" }, enableArea: false, areaBaselineValue: 0, areaOpacity: 0.2, areaBlendMode: "normal", lineWidth: 2, legends: [], isInteractive: true, tooltip: U, enableSlices: false, debugSlices: false, sliceTooltip: Z, debugMesh: false, enableCrosshair: true, crosshairType: "bottom-left" }, _ = Q({}, $, { enablePointLabel: false, useMesh: false, enableTouchCrosshair: false, animate: true, motionConfig: "gentle", defs: [], fill: [], role: "img", initialHiddenIds: [] });
Q({}, $, { pixelRatio: "undefined" != typeof window && window.devicePixelRatio || 1 });
var oe = function(e3) {
  var i2 = e3.curve;
  return useMemo(function() {
    return H$4().defined(function(e4) {
      return null !== e4.x && null !== e4.y;
    }).x(function(e4) {
      return e4.x;
    }).y(function(e4) {
      return e4.y;
    }).curve(lt(i2));
  }, [i2]);
}, ie = function(e3) {
  var i2 = e3.curve, t2 = e3.yScale, n2 = e3.areaBaselineValue;
  return useMemo(function() {
    return Y$5().defined(function(e4) {
      return null !== e4.x && null !== e4.y;
    }).x(function(e4) {
      return e4.x;
    }).y1(function(e4) {
      return e4.y;
    }).curve(lt(i2)).y0(t2(n2));
  }, [i2, t2, n2]);
}, te = function(e3) {
  var i2 = e3.componentId, t2 = e3.enableSlices, n2 = e3.points, r2 = e3.width, a2 = e3.height;
  return useMemo(function() {
    if (false === t2) return [];
    if ("x" === t2) {
      var e4 = /* @__PURE__ */ new Map();
      return n2.forEach(function(o3) {
        null !== o3.data.x && null !== o3.data.y && (e4.has(o3.x) ? e4.get(o3.x).push(o3) : e4.set(o3.x, [o3]));
      }), Array.from(e4.entries()).sort(function(e6, o3) {
        return e6[0] - o3[0];
      }).map(function(e6, o3, t3) {
        var n3, l2, s = e6[0], d = e6[1], c2 = t3[o3 - 1], u2 = t3[o3 + 1];
        return n3 = c2 ? s - (s - c2[0]) / 2 : s, l2 = u2 ? s - n3 + (u2[0] - s) / 2 : r2 - n3, { id: "slice:" + i2 + ":" + s, x0: n3, x: s, y0: 0, y: 0, width: l2, height: a2, points: d.reverse() };
      });
    }
    if ("y" === t2) {
      var o2 = /* @__PURE__ */ new Map();
      return n2.forEach(function(e6) {
        null !== e6.data.x && null !== e6.data.y && (o2.has(e6.y) ? o2.get(e6.y).push(e6) : o2.set(e6.y, [e6]));
      }), Array.from(o2.entries()).sort(function(e6, o3) {
        return e6[0] - o3[0];
      }).map(function(e6, o3, i3) {
        var t3, n3, l2 = e6[0], s = e6[1], d = i3[o3 - 1], c2 = i3[o3 + 1];
        return t3 = d ? l2 - (l2 - d[0]) / 2 : l2, n3 = c2 ? l2 - t3 + (c2[0] - l2) / 2 : a2 - t3, { id: l2, x0: 0, x: 0, y0: t3, y: l2, width: r2, height: n3, points: s.reverse() };
      });
    }
  }, [i2, t2, a2, n2, r2]);
}, ne = "line", re = function(e3) {
  var n2 = e3.data, r2 = e3.xScale, a2 = void 0 === r2 ? _.xScale : r2, l2 = e3.xFormat, s = e3.yScale, c2 = void 0 === s ? _.yScale : s, h = e3.yFormat, f2 = e3.width, v2 = e3.height, p2 = e3.colors, m2 = void 0 === p2 ? _.colors : p2, g2 = e3.curve, y2 = void 0 === g2 ? _.curve : g2, x2 = e3.areaBaselineValue, b2 = void 0 === x2 ? _.areaBaselineValue : x2, S2 = e3.pointColor, M2 = void 0 === S2 ? _.pointColor : S2, C2 = e3.pointBorderColor, k2 = void 0 === C2 ? _.pointBorderColor : C2, B2 = e3.enableSlices, W2 = void 0 === B2 ? _.enableSlicesTooltip : B2, E2 = e3.initialHiddenIds, L2 = void 0 === E2 ? _.initialHiddenIds : E2, G2 = useState(A$5(ne))[0], P2 = Ot(l2), F2 = Ot(h), O2 = pr(m2, "id"), V2 = zt(), I2 = Xe(M2, V2), H2 = Xe(k2, V2), Y2 = useState(null != L2 ? L2 : []), X2 = Y2[0], z2 = Y2[1], j2 = useMemo(function() {
    return dn(n2.filter(function(e4) {
      return -1 === X2.indexOf(e4.id);
    }), a2, c2, f2, v2);
  }, [n2, X2, a2, c2, f2, v2]), D2 = j2.xScale, q2 = j2.yScale, J2 = j2.series, K2 = useMemo(function() {
    var e4 = n2.map(function(e6) {
      return { id: e6.id, label: e6.id, color: O2(e6) };
    }), o2 = e4.map(function(e6) {
      return Q({}, J2.find(function(o3) {
        return o3.id === e6.id;
      }), { color: e6.color });
    }).filter(function(e6) {
      return Boolean(e6.id);
    });
    return { legendData: e4.map(function(e6) {
      return Q({}, e6, { hidden: !o2.find(function(o3) {
        return o3.id === e6.id;
      }) });
    }).reverse(), series: o2 };
  }, [n2, J2, O2]), N2 = K2.legendData, U2 = K2.series, Z2 = useCallback(function(e4) {
    z2(function(o2) {
      return o2.indexOf(e4) > -1 ? o2.filter(function(o3) {
        return o3 !== e4;
      }) : [].concat(o2, [e4]);
    });
  }, []), $2 = function(e4) {
    var i2 = e4.series, t2 = e4.getPointColor, n3 = e4.getPointBorderColor, r3 = e4.formatX, a3 = e4.formatY;
    return useMemo(function() {
      return i2.reduce(function(e6, o2) {
        return [].concat(e6, o2.data.filter(function(e7) {
          return null !== e7.position.x && null !== e7.position.y;
        }).map(function(i3, l3) {
          var s2 = { id: o2.id + "." + l3, index: e6.length + l3, serieId: o2.id, serieColor: o2.color, x: i3.position.x, y: i3.position.y };
          return s2.color = t2(o2), s2.borderColor = n3(s2), s2.data = Q({}, i3.data, { xFormatted: r3(i3.data.x), yFormatted: a3(i3.data.y) }), s2;
        }));
      }, []);
    }, [i2, t2, n3, r3, a3]);
  }({ series: U2, getPointColor: I2, getPointBorderColor: H2, formatX: P2, formatY: F2 }), ee = te({ componentId: G2, enableSlices: W2, points: $2, width: f2, height: v2 });
  return { legendData: N2, toggleSerie: Z2, lineGenerator: oe({ curve: y2 }), areaGenerator: ie({ curve: y2, yScale: q2, areaBaselineValue: b2 }), getColor: O2, series: U2, xScale: D2, yScale: q2, slices: ee, points: $2 };
}, ae = function(e3) {
  var o2 = e3.areaBlendMode, i2 = e3.areaOpacity, t2 = e3.color, n2 = e3.fill, r2 = e3.path, a2 = Ur(), l2 = a2.animate, s = a2.config, d = Fr(r2), c2 = useSpring({ color: t2, config: s, immediate: !l2 });
  return jsx(animated.path, { d, fill: n2 || c2.color, fillOpacity: i2, strokeWidth: 0, style: { mixBlendMode: o2 } });
}, le = memo(function(e3) {
  var o2 = e3.areaGenerator, i2 = e3.areaOpacity, t2 = e3.areaBlendMode, n2 = e3.lines.slice(0).reverse();
  return jsx("g", { children: n2.map(function(e4) {
    return jsx(ae, Q({ path: o2(e4.data.map(function(e6) {
      return e6.position;
    })) }, Q({ areaOpacity: i2, areaBlendMode: t2 }, e4)), e4.id);
  }) });
}), se = memo(function(e3) {
  var i2 = e3.lineGenerator, t2 = e3.points, n2 = e3.color, r2 = e3.thickness, a2 = useMemo(function() {
    return i2(t2);
  }, [i2, t2]), l2 = Fr(a2);
  return jsx(animated.path, { d: l2, fill: "none", strokeWidth: r2, stroke: n2 });
}), de = memo(function(e3) {
  var o2 = e3.lines, i2 = e3.lineGenerator, t2 = e3.lineWidth;
  return o2.slice(0).reverse().map(function(e4) {
    var o3 = e4.id, n2 = e4.data, r2 = e4.color;
    return jsx(se, { id: o3, points: n2.map(function(e6) {
      return e6.position;
    }), lineGenerator: i2, color: r2, thickness: t2 }, o3);
  });
}), ce = memo(function(e3) {
  var o2 = e3.slice, i2 = e3.slices, r2 = e3.axis, a2 = e3.debug, l2 = e3.tooltip, s = e3.isCurrent, d = e3.setCurrent, c2 = e3.onMouseEnter, u2 = e3.onMouseMove, h = e3.onMouseLeave, f2 = e3.onClick, v2 = e3.onTouchStart, p2 = e3.onTouchMove, m2 = e3.onTouchEnd, g2 = k$1(), y2 = g2.showTooltipFromEvent, x2 = g2.hideTooltip, b2 = useCallback(function(e4) {
    y2(createElement(l2, { slice: o2, axis: r2 }), e4, "right"), d(o2), c2 && c2(o2, e4);
  }, [y2, l2, o2, r2, d, c2]), S2 = useCallback(function(e4) {
    y2(createElement(l2, { slice: o2, axis: r2 }), e4, "right"), u2 && u2(o2, e4);
  }, [y2, l2, o2, r2, u2]), M2 = useCallback(function(e4) {
    x2(), d(null), h && h(o2, e4);
  }, [x2, d, h, o2]), C2 = useCallback(function(e4) {
    f2 && f2(o2, e4);
  }, [o2, f2]), w2 = useCallback(function(e4) {
    y2(createElement(l2, { slice: o2, axis: r2 }), e4, "right"), d(o2), v2 && v2(o2, e4);
  }, [r2, v2, d, y2, o2, l2]), T2 = useCallback(function(e4) {
    var t2 = e4.touches[0], a3 = document.elementFromPoint(t2.clientX, t2.clientY), s2 = null == a3 ? void 0 : a3.getAttribute("data-ref");
    if (s2) {
      var c3 = i2.find(function(e6) {
        return e6.id === s2;
      });
      c3 && (y2(createElement(l2, { slice: c3, axis: r2 }), e4, "right"), d(c3));
    }
    p2 && p2(o2, e4);
  }, [r2, p2, d, y2, o2, i2, l2]), k2 = useCallback(function(e4) {
    x2(), d(null), m2 && m2(o2, e4);
  }, [x2, d, m2, o2]);
  return jsx("rect", { x: o2.x0, y: o2.y0, width: o2.width, height: o2.height, stroke: "red", strokeWidth: a2 ? 1 : 0, strokeOpacity: 0.75, fill: "red", fillOpacity: s && a2 ? 0.35 : 0, onMouseEnter: b2, onMouseMove: S2, onMouseLeave: M2, onClick: C2, onTouchStart: w2, onTouchMove: T2, onTouchEnd: k2, "data-ref": o2.id });
}), ue = memo(function(e3) {
  var o2 = e3.slices, i2 = e3.axis, t2 = e3.debug, n2 = e3.height, r2 = e3.tooltip, a2 = e3.current, l2 = e3.setCurrent, s = e3.onMouseEnter, d = e3.onMouseMove, c2 = e3.onMouseLeave, u2 = e3.onClick, h = e3.onTouchStart, f2 = e3.onTouchMove, v2 = e3.onTouchEnd;
  return o2.map(function(e4) {
    return jsx(ce, { slice: e4, slices: o2, axis: i2, debug: t2, height: n2, tooltip: r2, setCurrent: l2, isCurrent: null !== a2 && a2.id === e4.id, onMouseEnter: s, onMouseMove: d, onMouseLeave: c2, onClick: u2, onTouchStart: h, onTouchMove: f2, onTouchEnd: v2 }, e4.id);
  });
}), he = memo(function(e3) {
  var o2 = e3.points, i2 = e3.symbol, t2 = e3.size, n2 = e3.borderWidth, r2 = e3.enableLabel, a2 = e3.label, l2 = e3.labelYOffset, s = zt(), c2 = qn(a2), u2 = o2.slice(0).reverse().map(function(e4) {
    return { id: e4.id, x: e4.x, y: e4.y, datum: e4.data, fill: e4.color, stroke: e4.borderColor, label: r2 ? c2(e4) : null };
  });
  return jsx("g", { children: u2.map(function(e4) {
    return jsx(vn$1, { x: e4.x, y: e4.y, datum: e4.datum, symbol: i2, size: t2, color: e4.fill, borderWidth: n2, borderColor: e4.stroke, label: e4.label, labelYOffset: l2, theme: s }, e4.id);
  }) });
}), fe = memo(function(e3) {
  var o2 = e3.points, i2 = e3.width, r2 = e3.height, a2 = e3.margin, l2 = e3.setCurrent, s = e3.onMouseEnter, d = e3.onMouseMove, c2 = e3.onMouseLeave, u2 = e3.onClick, h = e3.onTouchStart, f2 = e3.onTouchMove, v2 = e3.onTouchEnd, p2 = e3.tooltip, m2 = e3.debug, g2 = e3.enableTouchCrosshair, y2 = k$1(), x2 = y2.showTooltipAt, b2 = y2.hideTooltip, S2 = useCallback(function(e4, o3) {
    x2(createElement(p2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), s && s(e4, o3);
  }, [x2, p2, s, a2]), M2 = useCallback(function(e4, o3) {
    x2(createElement(p2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), d && d(e4, o3);
  }, [x2, p2, a2.left, a2.top, d]), C2 = useCallback(function(e4, o3) {
    b2(), c2 && c2(e4, o3);
  }, [b2, c2]), w2 = useCallback(function(e4, o3) {
    u2 && u2(e4, o3);
  }, [u2]), T2 = useCallback(function(e4, o3) {
    x2(createElement(p2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), h && h(e4, o3);
  }, [a2.left, a2.top, h, x2, p2]), k2 = useCallback(function(e4, o3) {
    x2(createElement(p2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), f2 && f2(e4, o3);
  }, [a2.left, a2.top, f2, x2, p2]), B2 = useCallback(function(e4, o3) {
    b2(), v2 && v2(e4, o3);
  }, [v2, b2]);
  return jsx(I, { nodes: o2, width: i2, height: r2, setCurrent: l2, onMouseEnter: S2, onMouseMove: M2, onMouseLeave: C2, onClick: w2, onTouchStart: T2, onTouchMove: k2, onTouchEnd: B2, enableTouchCrosshair: g2, debug: m2 });
}), ve = On(function(e3) {
  var o2 = e3.data, t2 = e3.xScale, n2 = void 0 === t2 ? { type: "point" } : t2, a2 = e3.xFormat, l2 = e3.yScale, s = void 0 === l2 ? { type: "linear", min: 0, max: "auto" } : l2, c2 = e3.yFormat, u2 = e3.layers, h = void 0 === u2 ? ["grid", "markers", "axes", "areas", "crosshair", "lines", "points", "slices", "mesh", "legends"] : u2, f2 = e3.curve, v2 = void 0 === f2 ? "linear" : f2, p2 = e3.areaBaselineValue, m2 = void 0 === p2 ? 0 : p2, S2 = e3.colors, M2 = void 0 === S2 ? { scheme: "nivo" } : S2, C2 = e3.margin, w2 = e3.width, W2 = e3.height, E2 = e3.axisTop, G2 = e3.axisRight, P2 = e3.axisBottom, F2 = void 0 === P2 ? {} : P2, O$12 = e3.axisLeft, V2 = void 0 === O$12 ? {} : O$12, H2 = e3.enableGridX, Y2 = void 0 === H2 || H2, R = e3.enableGridY, A2 = void 0 === R || R, z2 = e3.gridXValues, j2 = e3.gridYValues, D2 = e3.lineWidth, q2 = void 0 === D2 ? 2 : D2, J2 = e3.enableArea, K2 = void 0 !== J2 && J2, N2 = e3.areaOpacity, $2 = void 0 === N2 ? 0.2 : N2, _2 = e3.areaBlendMode, ee = void 0 === _2 ? "normal" : _2, oe2 = e3.enablePoints, ie2 = void 0 === oe2 || oe2, te2 = e3.pointSymbol, ne2 = e3.pointSize, ae2 = void 0 === ne2 ? 6 : ne2, se2 = e3.pointColor, ce2 = void 0 === se2 ? { from: "color" } : se2, ve2 = e3.pointBorderWidth, pe2 = void 0 === ve2 ? 0 : ve2, me2 = e3.pointBorderColor, ge2 = void 0 === me2 ? { theme: "background" } : me2, ye2 = e3.enablePointLabel, xe = void 0 !== ye2 && ye2, be2 = e3.pointLabel, Se = void 0 === be2 ? "data.yFormatted" : be2, Me2 = e3.pointLabelYOffset, Ce2 = e3.defs, we = void 0 === Ce2 ? [] : Ce2, Te2 = e3.fill, ke = void 0 === Te2 ? [] : Te2, Be2 = e3.markers, We2 = e3.legends, Ee = void 0 === We2 ? [] : We2, Le2 = e3.isInteractive, Ge2 = void 0 === Le2 || Le2, Pe2 = e3.useMesh, Fe = void 0 !== Pe2 && Pe2, Oe = e3.debugMesh, Ve2 = void 0 !== Oe && Oe, Ie = e3.onMouseEnter, He2 = e3.onMouseMove, Ye = e3.onMouseLeave, Re2 = e3.onClick, Ae = e3.onTouchStart, Xe$12 = e3.onTouchMove, ze = e3.onTouchEnd, je2 = e3.tooltip, De2 = void 0 === je2 ? U : je2, qe2 = e3.enableSlices, Je2 = void 0 !== qe2 && qe2, Ke2 = e3.debugSlices, Ne = void 0 !== Ke2 && Ke2, Qe2 = e3.sliceTooltip, Ue2 = void 0 === Qe2 ? Z : Qe2, Ze2 = e3.enableCrosshair, $e2 = void 0 === Ze2 || Ze2, _e2 = e3.crosshairType, eo = void 0 === _e2 ? "bottom-left" : _e2, oo = e3.enableTouchCrosshair, io = void 0 !== oo && oo, to2 = e3.role, no = void 0 === to2 ? "img" : to2, ro = e3.initialHiddenIds, ao = void 0 === ro ? [] : ro, lo = wt(w2, W2, C2), so = lo.margin, co = lo.innerWidth, uo = lo.innerHeight, ho = lo.outerWidth, fo = lo.outerHeight, vo = re({ data: o2, xScale: n2, xFormat: a2, yScale: s, yFormat: c2, width: co, height: uo, colors: M2, curve: v2, areaBaselineValue: m2, pointColor: ce2, pointBorderColor: ge2, enableSlices: Je2, initialHiddenIds: ao }), po = vo.legendData, mo = vo.toggleSerie, go = vo.lineGenerator, yo = vo.areaGenerator, xo = vo.series, bo = vo.xScale, So = vo.yScale, Mo = vo.slices, Co = vo.points, wo = zt(), To = Xe(ce2, wo), ko = Xe(ge2, wo), Bo = useState(null), Wo = Bo[0], Eo = Bo[1], Lo = useState(null), Go = Lo[0], Po = Lo[1], Fo = { grid: jsx(C$3, { theme: wo, width: co, height: uo, xScale: Y2 ? bo : null, yScale: A2 ? So : null, xValues: z2, yValues: j2 }, "grid"), markers: jsx(Rn, { markers: Be2, width: co, height: uo, xScale: bo, yScale: So, theme: wo }, "markers"), axes: jsx(B$1, { xScale: bo, yScale: So, width: co, height: uo, theme: wo, top: E2, right: G2, bottom: F2, left: V2 }, "axes"), areas: null, lines: jsx(de, { lines: xo, lineGenerator: go, lineWidth: q2 }, "lines"), slices: null, points: null, crosshair: null, mesh: null, legends: Ee.map(function(e4, o3) {
    return jsx(O, Q({}, e4, { containerWidth: co, containerHeight: uo, data: e4.data || po, theme: wo, toggleSerie: e4.toggleSerie ? mo : void 0 }), "legend." + o3);
  }) }, Oo = In(we, xo, ke);
  return K2 && (Fo.areas = jsx(le, { areaGenerator: yo, areaOpacity: $2, areaBlendMode: ee, lines: xo }, "areas")), Ge2 && false !== Je2 && (Fo.slices = jsx(ue, { slices: Mo, axis: Je2, debug: Ne, height: uo, tooltip: Ue2, current: Go, setCurrent: Po, onMouseEnter: Ie, onMouseMove: He2, onMouseLeave: Ye, onClick: Re2, onTouchStart: Ae, onTouchMove: Xe$12, onTouchEnd: ze }, "slices")), ie2 && (Fo.points = jsx(he, { points: Co, symbol: te2, size: ae2, color: To, borderWidth: pe2, borderColor: ko, enableLabel: xe, label: Se, labelYOffset: Me2 }, "points")), Ge2 && $e2 && (null !== Wo && (Fo.crosshair = jsx(P$2, { width: co, height: uo, x: Wo.x, y: Wo.y, type: eo }, "crosshair")), null !== Go && (Fo.crosshair = jsx(P$2, { width: co, height: uo, x: Go.x, y: Go.y, type: Je2 }, "crosshair"))), Ge2 && Fe && false === Je2 && (Fo.mesh = jsx(fe, { points: Co, width: co, height: uo, margin: so, current: Wo, setCurrent: Eo, onMouseEnter: Ie, onMouseMove: He2, onMouseLeave: Ye, onClick: Re2, onTouchStart: Ae, onTouchMove: Xe$12, onTouchEnd: ze, tooltip: De2, enableTouchCrosshair: io, debug: Ve2 }, "mesh")), jsx(gn$1, { defs: Oo, width: ho, height: fo, margin: so, role: no, children: h.map(function(o3, i2) {
    return "function" == typeof o3 ? jsx(Fragment$1, { children: o3(Q({}, e3, { innerWidth: co, innerHeight: uo, series: xo, slices: Mo, points: Co, xScale: bo, yScale: So, lineGenerator: go, areaGenerator: yo, currentPoint: Wo, setCurrentPoint: Eo, currentSlice: Go, setCurrentSlice: Po })) }, i2) : Fo[o3];
  }) });
}), pe = function(e3) {
  return jsx(It, { children: function(o2) {
    var i2 = o2.width, t2 = o2.height;
    return jsx(ve, Q({ width: i2, height: t2 }, e3));
  } });
}, me = On(function(e3) {
  var o2 = useRef(null), r2 = e3.width, a2 = e3.height, c2 = e3.margin, u2 = e3.pixelRatio, h = void 0 === u2 ? "undefined" != typeof window && window.devicePixelRatio || 1 : u2, f2 = e3.data, v2 = e3.xScale, p2 = void 0 === v2 ? { type: "point" } : v2, m2 = e3.xFormat, y2 = e3.yScale, x2 = void 0 === y2 ? { type: "linear", min: 0, max: "auto" } : y2, b2 = e3.yFormat, S2 = e3.curve, w2 = void 0 === S2 ? "linear" : S2, T2 = e3.layers, k2 = void 0 === T2 ? ["grid", "markers", "axes", "areas", "crosshair", "lines", "points", "slices", "mesh", "legends"] : T2, B2 = e3.colors, L2 = void 0 === B2 ? { scheme: "nivo" } : B2, P2 = e3.lineWidth, F2 = void 0 === P2 ? 2 : P2, O2 = e3.enableArea, I2 = void 0 !== O2 && O2, H$22 = e3.areaBaselineValue, Y2 = void 0 === H$22 ? 0 : H$22, R = e3.areaOpacity, A2 = void 0 === R ? 0.2 : R, z$22 = e3.enablePoints, j2 = void 0 === z$22 || z$22, D2 = e3.pointSize, q2 = void 0 === D2 ? 6 : D2, Z2 = e3.pointColor, $2 = void 0 === Z2 ? { from: "color" } : Z2, _2 = e3.pointBorderWidth, ee = void 0 === _2 ? 0 : _2, oe2 = e3.pointBorderColor, ie2 = void 0 === oe2 ? { theme: "background" } : oe2, te2 = e3.enableGridX, ne2 = void 0 === te2 || te2, ae2 = e3.gridXValues, le2 = e3.enableGridY, se2 = void 0 === le2 || le2, de2 = e3.gridYValues, ce2 = e3.axisTop, ue2 = e3.axisRight, he2 = e3.axisBottom, fe2 = void 0 === he2 ? {} : he2, ve2 = e3.axisLeft, pe2 = void 0 === ve2 ? {} : ve2, me2 = e3.legends, ge2 = void 0 === me2 ? [] : me2, ye2 = e3.isInteractive, xe = void 0 === ye2 || ye2, be2 = e3.debugMesh, Se = void 0 !== be2 && be2, Me2 = e3.onMouseLeave, Ce2 = e3.onClick, we = e3.tooltip, Te2 = void 0 === we ? U : we, ke = e3.canvasRef, Be2 = wt(r2, a2, c2), We2 = Be2.margin, Ee = Be2.innerWidth, Le2 = Be2.innerHeight, Ge2 = Be2.outerWidth, Pe2 = Be2.outerHeight, Fe = zt(), Oe = useState(null), Ve2 = Oe[0], Ie = Oe[1], He2 = re({ data: f2, xScale: p2, xFormat: m2, yScale: x2, yFormat: b2, width: Ee, height: Le2, colors: L2, curve: w2, areaBaselineValue: Y2, pointColor: $2, pointBorderColor: ie2 }), Ye = He2.lineGenerator, Re2 = He2.areaGenerator, Ae = He2.series, Xe2 = He2.xScale, ze = He2.yScale, je2 = He2.points, De2 = W({ points: je2, width: Ee, height: Le2, debug: Se }), qe2 = De2.delaunay, Je2 = De2.voronoi;
  useEffect(function() {
    ke && (ke.current = o2.current), o2.current.width = Ge2 * h, o2.current.height = Pe2 * h;
    var e4 = o2.current.getContext("2d");
    e4.scale(h, h), e4.fillStyle = Fe.background, e4.fillRect(0, 0, Ge2, Pe2), e4.translate(We2.left, We2.top), k2.forEach(function(o3) {
      if ("function" == typeof o3 && o3({ ctx: e4, innerWidth: Ee, innerHeight: Le2, series: Ae, points: je2, xScale: Xe2, yScale: ze, lineWidth: F2, lineGenerator: Ye, areaGenerator: Re2, currentPoint: Ve2, setCurrentPoint: Ie }), "grid" === o3 && Fe.grid.line.strokeWidth > 0 && (e4.lineWidth = Fe.grid.line.strokeWidth, e4.strokeStyle = Fe.grid.line.stroke, ne2 && z$1(e4, { width: Ee, height: Le2, scale: Xe2, axis: "x", values: ae2 }), se2 && z$1(e4, { width: Ee, height: Le2, scale: ze, axis: "y", values: de2 })), "axes" === o3 && j$2(e4, { xScale: Xe2, yScale: ze, width: Ee, height: Le2, top: ce2, right: ue2, bottom: fe2, left: pe2, theme: Fe }), "areas" === o3 && true === I2) {
        e4.save(), e4.globalAlpha = A2, Re2.context(e4);
        for (var i2 = Ae.length - 1; i2 >= 0; i2--) e4.fillStyle = Ae[i2].color, e4.beginPath(), Re2(Ae[i2].data.map(function(e6) {
          return e6.position;
        })), e4.fill();
        e4.restore();
      }
      if ("lines" === o3 && (Ye.context(e4), Ae.forEach(function(o4) {
        e4.strokeStyle = o4.color, e4.lineWidth = F2, e4.beginPath(), Ye(o4.data.map(function(e6) {
          return e6.position;
        })), e4.stroke();
      })), "points" === o3 && true === j2 && q2 > 0 && je2.forEach(function(o4) {
        e4.fillStyle = o4.color, e4.beginPath(), e4.arc(o4.x, o4.y, q2 / 2, 0, 2 * Math.PI), e4.fill(), ee > 0 && (e4.strokeStyle = o4.borderColor, e4.lineWidth = ee, e4.stroke());
      }), "mesh" === o3 && true === Se && (z(e4, Je2), Ve2 && H(e4, Je2, Ve2.index)), "legends" === o3) {
        var t2 = Ae.map(function(e6) {
          return { id: e6.id, label: e6.id, color: e6.color };
        }).reverse();
        ge2.forEach(function(o4) {
          H$1(e4, Q({}, o4, { data: o4.data || t2, containerWidth: Ee, containerHeight: Le2, theme: Fe }));
        });
      }
    });
  }, [o2, Ge2, Pe2, k2, Fe, Ye, Ae, Xe2, ze, ne2, ae2, se2, de2, ce2, ue2, fe2, pe2, ge2, je2, j2, q2, Ve2]);
  var Ke2 = useCallback(function(e4) {
    var i2 = Sn(o2.current, e4), t2 = i2[0], n2 = i2[1];
    if (!jn(We2.left, We2.top, Ee, Le2, t2, n2)) return null;
    var r3 = qe2.find(t2 - We2.left, n2 - We2.top);
    return je2[r3];
  }, [o2, We2, Ee, Le2, qe2]), Ne = k$1(), Qe2 = Ne.showTooltipFromEvent, Ue2 = Ne.hideTooltip, Ze2 = useCallback(function(e4) {
    var o3 = Ke2(e4);
    Ie(o3), o3 ? Qe2(createElement(Te2, { point: o3 }), e4) : Ue2();
  }, [Ke2, Ie, Qe2, Ue2, Te2]), $e2 = useCallback(function(e4) {
    Ue2(), Ie(null), Ve2 && Me2 && Me2(Ve2, e4);
  }, [Ue2, Ie, Me2]), _e2 = useCallback(function(e4) {
    if (Ce2) {
      var o3 = Ke2(e4);
      o3 && Ce2(o3, e4);
    }
  }, [Ke2, Ce2]);
  return jsx("canvas", { ref: o2, width: Ge2 * h, height: Pe2 * h, style: { width: Ge2, height: Pe2, cursor: xe ? "auto" : "normal" }, onMouseEnter: xe ? Ze2 : void 0, onMouseMove: xe ? Ze2 : void 0, onMouseLeave: xe ? $e2 : void 0, onClick: xe ? _e2 : void 0 });
}), ge = forwardRef(function(e3, o2) {
  return jsx(me, Q({}, e3, { canvasRef: o2 }));
});
forwardRef(function(e3, o2) {
  return jsx(It, { children: function(i2) {
    var t2 = i2.width, n2 = i2.height;
    return jsx(ge, Q({ width: t2, height: n2 }, e3, { ref: o2 }));
  } });
});
const nivoTheme = {
  background: "transparent",
  text: {
    fontSize: 11,
    fill: "#333333",
    outlineWidth: 0,
    outlineColor: "transparent"
  },
  axis: {
    domain: {
      line: {
        stroke: "#777777",
        strokeWidth: 1
      }
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#333333",
        outlineWidth: 0,
        outlineColor: "transparent"
      }
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1
      },
      text: {
        fontSize: 11,
        fill: "#333333",
        outlineWidth: 0,
        outlineColor: "transparent"
      }
    }
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1
    }
  },
  legends: {
    text: {
      fontSize: 11,
      fill: "#333333",
      outlineWidth: 0,
      outlineColor: "transparent"
    }
  },
  labels: {
    text: {
      fontSize: 11,
      fill: "#333333",
      outlineWidth: 0,
      outlineColor: "transparent"
    }
  }
  // markers: {
  //   fontSize: 11,
  //   fill: "#333333",
  //   outlineWidth: 0,
  //   outlineColor: "transparent",
  // },
};
async function fetch5YearReturns(ticker2) {
  console.log("Fetching 5-year returns for", ticker2);
  const apiKey = "2PSVgNTDY7FjQZobFDb7zZI3wfbVtzAi";
  const url = new URL(
    `https://financialmodelingprep.com/api/v3/stock-price-change/${ticker2}`
  );
  url.searchParams.append("apikey", apiKey);
  const response = await fetch(url.toString());
  const data = await response.json();
  const fiveYearTotal = data[0]["5Y"];
  const annualizedReturn = calculateAnnualizedReturn(fiveYearTotal, 5);
  return {
    annualizedReturn
  };
}
function calculateAnnualizedReturn(totalReturnPercentage, years) {
  const totalReturnDecimal = totalReturnPercentage / 100;
  const annualizedReturn = (Math.pow(1 + totalReturnDecimal, 1 / years) - 1) * 100;
  return annualizedReturn;
}
function ETFList({ tickers, onRemove, onReturnsUpdate }) {
  const { etfData } = useLoaderData();
  const [returnsData, setReturnsData] = useState([]);
  const [fetchedTickers, setFetchedTickers] = useState(/* @__PURE__ */ new Set());
  const [fetchingTickers, setFetchingTickers] = useState(
    /* @__PURE__ */ new Set()
  );
  useEffect(() => {
    const newTickers = tickers.filter(
      (ticker2) => !fetchedTickers.has(ticker2) && !fetchingTickers.has(ticker2)
    );
    if (newTickers.length === 0) return;
    const fetchReturns = async () => {
      setFetchingTickers((prev) => /* @__PURE__ */ new Set([...prev, ...newTickers]));
      const newReturnsData = await Promise.all(
        newTickers.map(async (ticker2) => {
          try {
            const { annualizedReturn } = await fetch5YearReturns(ticker2);
            return {
              ticker: ticker2,
              returns: annualizedReturn,
              isLoading: false
            };
          } catch (error) {
            console.error(`Error fetching returns for ${ticker2}:`, error);
            return {
              ticker: ticker2,
              returns: null,
              isLoading: false,
              error: "Failed to fetch returns"
            };
          }
        })
      );
      setReturnsData((prev) => {
        const existingData = prev.filter(
          (data) => tickers.includes(data.ticker)
        );
        return [...existingData, ...newReturnsData];
      });
      setFetchedTickers((prev) => {
        const next = new Set(prev);
        newTickers.forEach((ticker2) => next.add(ticker2));
        return next;
      });
      onReturnsUpdate([...newReturnsData]);
      setFetchingTickers((prev) => {
        newTickers.forEach((ticker2) => prev.delete(ticker2));
        return new Set(prev);
      });
    };
    fetchReturns();
  }, [tickers, fetchedTickers, fetchingTickers, onReturnsUpdate]);
  useEffect(() => {
    setFetchedTickers((prev) => {
      const next = new Set(prev);
      Array.from(prev).forEach((ticker2) => {
        if (!tickers.includes(ticker2)) {
          next.delete(ticker2);
        }
      });
      return next;
    });
  }, [tickers]);
  return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tickers.map((ticker2, index) => {
    var _a;
    const returnData = returnsData.find((d) => d.ticker === ticker2);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-between bg-stone-700 p-4 rounded-lg w-full",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-white", children: ticker2 }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-stone-300", children: etfData[ticker2] || "Loading..." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-stone-300", children: (returnData == null ? void 0 : returnData.isLoading) ? "Loading..." : (returnData == null ? void 0 : returnData.error) ? returnData.error : `5-Year Total Returns: ${((_a = returnData == null ? void 0 : returnData.returns) == null ? void 0 : _a.toFixed(2)) ?? "N/A"}%` }),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-stone-400 hover:text-white",
                onClick: () => onRemove(index),
                children: /* @__PURE__ */ jsx(X$6, { className: "h-4 w-4" })
              }
            )
          ] })
        ]
      },
      index
    );
  }) });
}
function FocusableInput({
  field,
  isFocused,
  setIsFocused,
  formatter,
  parser
}) {
  const handleChange = (e3) => {
    const rawValue = e3.target.value;
    const parsedValue = parser(rawValue);
    if (parsedValue !== "") {
      const numberValue = parseFloat(parsedValue);
      if (!isNaN(numberValue)) {
        field.onChange(numberValue);
      }
    }
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleFocus = (e3) => {
    setIsFocused(true);
    e3.target.select();
  };
  return /* @__PURE__ */ jsx(
    Input,
    {
      ...field,
      type: "text",
      inputMode: "decimal",
      value: isFocused ? field.value : formatter(field.value),
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: (e3) => {
        if (e3.key === "Enter") {
          e3.preventDefault();
          e3.currentTarget.blur();
        }
      }
    }
  );
}
const formSchema = z$6.object({
  initialDeposit: z$6.number().positive({ message: "Amount must be greater than 0." }),
  monthlyDeposit: z$6.number().nonnegative({ message: "Amount cannot be negative." }),
  timePeriod: z$6.number().positive({ message: "Time period must be at least 1 year." }),
  userInterest: z$6.number().positive({ message: "Interest rate must be greater than 0." }),
  compFrequency: z$6.string(),
  etfTickers: z$6.array(z$6.string()).default([])
});
const defaultValues = {
  initialDeposit: 0,
  monthlyDeposit: 0,
  timePeriod: 0,
  userInterest: 0,
  compFrequency: "annual",
  etfTickers: []
};
function calculateCompoundInterest({
  principal,
  monthlyContribution,
  annualRate,
  years,
  frequency
}) {
  const frequencyMap = {
    annual: 1,
    semiannual: 2,
    quarter: 4,
    month: 12,
    day: 365
  };
  const n2 = frequencyMap[frequency];
  const r2 = annualRate / 100;
  const principalFV = principal * Math.pow(1 + r2 / n2, n2 * years);
  let contributionFV = 0;
  if (monthlyContribution > 0) {
    contributionFV = monthlyContribution * 12 * ((Math.pow(1 + r2 / n2, n2 * years) - 1) / (r2 / n2));
  }
  const totalContributions = principal + monthlyContribution * 12 * years;
  return {
    futureValue: principalFV + contributionFV,
    totalContributions,
    initialAmount: principal
  };
}
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn$4(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn$4(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn$4(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn$4(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn$4(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn$4("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn$4(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn$4("-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const loader$4 = async ({ request }) => {
  var _a;
  const url = new URL(request.url);
  const tickers = ((_a = url.searchParams.get("tickers")) == null ? void 0 : _a.split(",").filter(Boolean)) || [];
  if (tickers.length === 0) {
    return json({ etfData: {} });
  }
  const etfDataPromises = tickers.map(async (ticker2) => {
    const data = await getETFByTicker(ticker2);
    return {
      ticker: ticker2,
      name: (data == null ? void 0 : data.name) || null
    };
  });
  const etfDataResults = await Promise.all(etfDataPromises);
  const etfData = etfDataResults.reduce((acc, { ticker: ticker2, name }) => {
    if (name) {
      acc[ticker2] = name;
    }
    return acc;
  }, {});
  return json({ etfData });
};
function Compound() {
  var _a;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showEtfInput, setShowEtfInput] = useState(false);
  const [currentEtf, setCurrentEtf] = useState("");
  const [isInitialDepositFocused, setIsInitialDepositFocused] = useState(false);
  const [isMonthlyDepositFocused, setIsMonthlyDepositFocused] = useState(false);
  const [isInterestRateFocused, setIsInterestRateFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [annualInterestRate, setAnnualInterestRate] = useState(0);
  const [numberOfYears, setNumberOfYears] = useState(0);
  const [etfReturns, setEtfReturns] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      etfTickers: ((_a = searchParams.get("tickers")) == null ? void 0 : _a.split(",").filter(Boolean)) || []
    }
  });
  const handleEtfReturnsUpdate = useCallback((returns) => {
    setEtfReturns((prev) => {
      const existingTickers = new Set(prev.map((p2) => p2.ticker));
      const newReturns = returns.filter((r2) => !existingTickers.has(r2.ticker));
      return [...prev, ...newReturns];
    });
  }, []);
  function onSubmit(data) {
    setInitialInvestment(data.initialDeposit);
    setMonthlyContribution(data.monthlyDeposit);
    setAnnualInterestRate(data.userInterest);
    setNumberOfYears(data.timePeriod);
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
  function generateChartData() {
    const data = [];
    const futureValueData = [];
    for (let year2 = 0; year2 <= numberOfYears; year2++) {
      const result = calculateCompoundInterest({
        principal: initialInvestment,
        monthlyContribution,
        annualRate: annualInterestRate,
        years: year2,
        frequency: form.getValues("compFrequency")
      });
      futureValueData.push({ x: year2, y: result.futureValue });
    }
    data.push({
      id: `User (${annualInterestRate.toFixed(2)}%)`,
      color: "#3b82f6",
      data: futureValueData
    });
    etfReturns.forEach((etf) => {
      if (etf.returns !== null) {
        const etfData = [];
        for (let year2 = 0; year2 <= numberOfYears; year2++) {
          const result = calculateCompoundInterest({
            principal: initialInvestment,
            monthlyContribution,
            annualRate: etf.returns,
            years: year2,
            frequency: form.getValues("compFrequency")
          });
          etfData.push({ x: year2, y: result.futureValue });
        }
        data.push({
          id: `${etf.ticker} (${etf.returns.toFixed(2)}%)`,
          data: etfData
        });
      }
    });
    return data;
  }
  const addEtf = () => {
    if (currentEtf.trim()) {
      const currentTickers = form.getValues("etfTickers");
      form.setValue("etfTickers", [
        ...currentTickers,
        currentEtf.trim().toUpperCase()
      ]);
      setCurrentEtf("");
      setShowEtfInput(false);
    }
  };
  const removeEtf = (index) => {
    const currentTickers = form.getValues("etfTickers");
    const deletedTicker = currentTickers[index];
    form.setValue(
      "etfTickers",
      currentTickers.filter((_2, i2) => i2 !== index)
    );
    setEtfReturns((prev) => prev.filter((etf) => etf.ticker !== deletedTicker));
  };
  const etfTickers = form.watch("etfTickers");
  useEffect(() => {
    const tickers = etfTickers;
    if (tickers.length > 0) {
      navigate(`?tickers=${tickers.join(",")}`, { replace: true });
    } else {
      navigate("", { replace: true });
    }
  }, [etfTickers, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "flex m-8 p-4 space-x-4", children: [
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: form.handleSubmit(onSubmit),
        className: "bg-stone-600 rounded-xl w-2/5 space-y-8 p-4",
        children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "initialDeposit",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Initial Deposit" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  FocusableInput,
                  {
                    field,
                    isFocused: isInitialDepositFocused,
                    setIsFocused: setIsInitialDepositFocused,
                    formatter: formatCurrency,
                    parser: parseCurrencyInput
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "monthlyDeposit",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Monthly Deposit Amount" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  FocusableInput,
                  {
                    field,
                    isFocused: isMonthlyDepositFocused,
                    setIsFocused: setIsMonthlyDepositFocused,
                    formatter: formatCurrency,
                    parser: parseCurrencyInput
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "timePeriod",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Years to Grow" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    ...field,
                    type: "number",
                    onChange: (e3) => field.onChange(parseFloat(e3.target.value))
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "userInterest",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Interest Rate" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  FocusableInput,
                  {
                    field,
                    isFocused: isInterestRateFocused,
                    setIsFocused: setIsInterestRateFocused,
                    formatter: formatPercentage,
                    parser: parsePercentageInput
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "compFrequency",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Compound Frequency" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: field.onChange,
                    defaultValue: field.value,
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select compound frequency" }) }) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "annual", children: "Annually" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "semiannual", children: "Semiannually" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "quarter", children: "Quarterly" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "month", children: "Monthly" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "day", children: "Daily" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            form.watch("etfTickers").length > 0 && /* @__PURE__ */ jsx(
              ETFList,
              {
                tickers: form.watch("etfTickers"),
                onRemove: removeEtf,
                onReturnsUpdate: handleEtfReturnsUpdate
              }
            ),
            showEtfInput ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: currentEtf,
                  onChange: (e3) => setCurrentEtf(e3.target.value),
                  onKeyDown: (e3) => {
                    if (e3.key === "Enter") {
                      e3.preventDefault();
                      addEtf();
                    }
                  },
                  placeholder: "Enter ETF ticker",
                  className: "w-full"
                }
              ),
              /* @__PURE__ */ jsx(Button, { type: "button", onClick: addEtf, children: "Add" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setShowEtfInput(false),
                  children: "Cancel"
                }
              )
            ] }) : /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowEtfInput(true),
                children: "Add ETF"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", children: "Submit" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-start h-96 w-3/5", children: submitted && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: "Compound Calculator" }),
      /* @__PURE__ */ jsx("div", { className: "text-stone-300", children: "You can find the results of your compound interest calculation below." }),
      /* @__PURE__ */ jsx(Card, { className: "w-full p-4 mt-4", children: /* @__PURE__ */ jsx("div", { className: "h-[400px]", children: /* @__PURE__ */ jsx(
        pe,
        {
          data: generateChartData(),
          margin: { top: 50, right: 110, bottom: 50, left: 80 },
          xScale: { type: "point" },
          yScale: {
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false
          },
          yFormat: (value) => `$${Number(value).toLocaleString(void 0, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          axisTop: null,
          axisRight: null,
          axisBottom: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Years",
            legendOffset: 36,
            legendPosition: "middle"
          },
          axisLeft: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "US Dollars ($)",
            legendOffset: -70,
            legendPosition: "middle",
            format: (value) => `$${Number(value).toLocaleString(void 0, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`
          },
          enablePoints: true,
          pointSize: 10,
          pointColor: { theme: "background" },
          pointBorderWidth: 2,
          pointBorderColor: { from: "serieColor" },
          pointLabelYOffset: -12,
          useMesh: true,
          theme: nivoTheme,
          legends: [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 195,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 180,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]
        }
      ) }) })
    ] }) })
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Compound,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const CHART_COLORS = {
  POSITIVE: "#22c55e",
  // Tailwind green-500
  NEGATIVE: "#ef4444"
  // Tailwind red-500
};
function getChartColor(percentage) {
  return percentage >= 0 ? CHART_COLORS.POSITIVE : CHART_COLORS.NEGATIVE;
}
const ETFCard = ({
  ticker: ticker2,
  name,
  endPrice,
  priceChangePercentage,
  chartLines
}) => {
  const lineColor = getChartColor(priceChangePercentage);
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: `/etf?ticker=${ticker2}`, children: /* @__PURE__ */ jsxs(Card, { className: "w-[350px] !bg-zinc-800 cursor-pointer", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row justify-between align-items: flex-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: ticker2 }),
        /* @__PURE__ */ jsx(CardDescription, { children: name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "!mt-0", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: formatPrice(endPrice) }),
        /* @__PURE__ */ jsxs(CardDescription, { className: "text-neutral-500 dark:text-neutral-400", children: [
          priceChangePercentage,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { id: "card_chart", className: "h-20", children: /* @__PURE__ */ jsx(
      pe,
      {
        data: chartLines,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        xScale: { type: "point" },
        yScale: {
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false
        },
        yFormat: " >-.2f",
        axisTop: null,
        axisRight: null,
        axisBottom: null,
        axisLeft: null,
        isInteractive: false,
        colors: [lineColor],
        enablePoints: false,
        enableGridX: false,
        enableGridY: false
      }
    ) }) })
  ] }) }) });
};
ETFCard.propTypes = {
  ticker: c$3.string.isRequired,
  name: c$3.string.isRequired,
  endPrice: c$3.number.isRequired,
  priceChangePercentage: c$3.number.isRequired,
  chartLines: c$3.array.isRequired
};
function transformData(chartData2, timeframe) {
  if (!chartData2 || !chartData2.results || chartData2.results.length === 0) {
    return {
      chartLines: [],
      priceChange: { percentage: 0, startPrice: 0, endPrice: 0 }
    };
  }
  const results = chartData2.results;
  const startPrice = results[0].c;
  const endPrice = results[results.length - 1].c;
  const priceChange = calculatePriceChange(startPrice, endPrice);
  const transformedData = [
    {
      id: chartData2.ticker || "unknown",
      data: results.map((result) => ({
        x: formatDateChart(result.t, timeframe),
        y: result.c
      }))
    }
  ];
  return {
    chartLines: transformedData,
    priceChange
  };
}
function formatDateChart(timestamp, timeframe) {
  const date2 = new Date(timestamp);
  const timeOnly = {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };
  const dayAndTime = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };
  const dateOnly = {
    month: "short",
    day: "numeric",
    year: "numeric"
  };
  switch (timeframe) {
    case "1D":
      return date2.toLocaleString("en-US", timeOnly);
    case "1W":
    case "1M":
      return date2.toLocaleString("en-US", dayAndTime);
    case "YTD":
    case "1Y":
      return date2.toLocaleString("en-US", dateOnly);
    default:
      throw new Error(`Unsupported timeframe: ${timeframe}`);
  }
}
function calculatePriceChange(startPrice, endPrice) {
  const percentage = parseFloat(
    ((endPrice - startPrice) / startPrice * 100).toFixed(2)
  );
  return {
    percentage,
    startPrice,
    endPrice
  };
}
async function upsertETFCacheData(ticker2, lastPrice, priceChangePercentage, chartData2, timeframe = "1W") {
  const client = await pool.connect();
  try {
    const priceQuery = `
      INSERT INTO etf_cache_price (ticker, last_price, price_change_percentage, last_updated)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (ticker) 
      DO UPDATE SET 
        last_price = EXCLUDED.last_price,
        price_change_percentage = EXCLUDED.price_change_percentage,
        last_updated = CURRENT_TIMESTAMP;
    `;
    await client.query(priceQuery, [ticker2, lastPrice, priceChangePercentage]);
    const chartQuery = `
      INSERT INTO etf_cache_chart (ticker, timeframe, chart_data, last_updated)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (ticker, timeframe) 
      DO UPDATE SET 
        chart_data = EXCLUDED.chart_data,
        last_updated = CURRENT_TIMESTAMP;
    `;
    await client.query(chartQuery, [
      ticker2,
      timeframe,
      JSON.stringify(chartData2)
    ]);
    console.log(`Cache generated/updated for ${ticker2}: ${timeframe}`);
  } catch (error) {
    console.error(`Error updating cache for ${ticker2}:`, error);
  } finally {
    client.release();
  }
}
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn$4("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn$4(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
const ETF_CATEGORIES = {
  overall: {
    title: "Most Popular ETFs",
    tickers: [
      "SPY",
      "IVV",
      "VTI",
      "QQQ",
      "VOO",
      "EEM",
      "IWM",
      "EFA",
      "VEA",
      "VWO"
    ]
  },
  sp500: {
    title: "S&P 500",
    tickers: [
      "SPY",
      "IVE",
      "VOO",
      "SPLG",
      "IVW",
      "SCHX",
      "IVV",
      "SDY",
      "RSP",
      "DGRO"
    ]
  },
  nasdaq: {
    title: "Nasdaq",
    tickers: [
      "QQQ",
      "QQQM",
      "ONEQ",
      "QQQJ",
      "QQQN",
      "TQQQ",
      "QQEW",
      "QYLD",
      "IBB",
      "TQQQ"
    ]
  }
};
const loader$3 = async () => {
  const allTickers = [
    .../* @__PURE__ */ new Set([
      ...ETF_CATEGORIES.overall.tickers,
      ...ETF_CATEGORIES.sp500.tickers,
      ...ETF_CATEGORIES.nasdaq.tickers
    ])
  ];
  const timeframe = "1M";
  const apiKey = process.env.POLY_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }
  const etfDataPromises = allTickers.map(async (ticker2) => {
    const cachedData = await getCachedETFData(ticker2, timeframe);
    const isStale = await isCacheStale(ticker2, timeframe);
    if (!cachedData) {
      try {
        const [chartData2, tickerData] = await Promise.all([
          fetchChartData(ticker2, apiKey, timeframe),
          getETFByTicker(ticker2)
        ]);
        if (!chartData2) {
          return null;
        }
        const { chartLines, priceChange } = transformData(chartData2, timeframe);
        if (chartLines && priceChange.endPrice !== 0) {
          await upsertETFCacheData(
            ticker2,
            priceChange.endPrice,
            priceChange.percentage,
            chartLines,
            timeframe
          );
        }
        return {
          ticker: ticker2,
          name: tickerData == null ? void 0 : tickerData.name,
          endPrice: priceChange.endPrice,
          priceChangePercentage: priceChange.percentage,
          chartLines
        };
      } catch (error) {
        console.error(`${ticker2} API query failed:`, error);
        return null;
      }
    } else if (isStale) {
      try {
        const chartData2 = await fetchChartData(ticker2, apiKey, timeframe);
        if (!chartData2) {
          return {
            ticker: cachedData.ticker,
            name: cachedData.name,
            endPrice: cachedData.last_price,
            priceChangePercentage: cachedData.price_change_percentage,
            chartLines: cachedData.chart_data
          };
        }
        const { chartLines, priceChange } = transformData(chartData2, timeframe);
        if (chartLines && priceChange.endPrice !== 0) {
          await upsertETFCacheData(
            ticker2,
            priceChange.endPrice,
            priceChange.percentage,
            chartLines,
            timeframe
          );
        } else {
          return {
            ticker: cachedData.ticker,
            name: cachedData.name,
            endPrice: cachedData.last_price,
            priceChangePercentage: cachedData.price_change_percentage,
            chartLines: cachedData.chart_data
          };
        }
        return {
          ticker: ticker2,
          name: cachedData.name,
          endPrice: priceChange.endPrice,
          priceChangePercentage: priceChange.percentage,
          chartLines
        };
      } catch (error) {
        return {
          ticker: cachedData.ticker,
          name: cachedData.name,
          endPrice: cachedData.last_price,
          priceChangePercentage: cachedData.price_change_percentage,
          chartLines: cachedData.chart_data
        };
      }
    } else {
      return {
        ticker: cachedData.ticker,
        name: cachedData.name,
        endPrice: cachedData.last_price,
        priceChangePercentage: cachedData.price_change_percentage,
        chartLines: cachedData.chart_data
      };
    }
  });
  const etfDataResults = await Promise.all(etfDataPromises);
  const etfDataMap = etfDataResults.reduce((acc, data) => {
    if (data) {
      acc[data.ticker] = data;
    }
    return acc;
  }, {});
  return {
    categories: {
      overall: {
        title: ETF_CATEGORIES.overall.title,
        etfs: ETF_CATEGORIES.overall.tickers.map((ticker2) => etfDataMap[ticker2]).filter(Boolean)
      },
      sp500: {
        title: ETF_CATEGORIES.sp500.title,
        etfs: ETF_CATEGORIES.sp500.tickers.map((ticker2) => etfDataMap[ticker2]).filter(Boolean)
      },
      nasdaq: {
        title: ETF_CATEGORIES.nasdaq.title,
        etfs: ETF_CATEGORIES.nasdaq.tickers.map((ticker2) => etfDataMap[ticker2]).filter(Boolean)
      }
    }
  };
};
function Overview() {
  const { categories } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: Object.entries(categories).map(([key, category]) => {
    var _a;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "p-5 py-2", children: /* @__PURE__ */ jsx("h1", { className: "my-1 text-2xl font-bold", children: category.title }) }),
      /* @__PURE__ */ jsxs(ScrollArea, { className: "w-full whitespace-nowrap pb-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex w-max space-x-4 p-4", children: (_a = category.etfs) == null ? void 0 : _a.map((etf) => /* @__PURE__ */ jsx(
          ETFCard,
          {
            ticker: etf.ticker,
            name: etf.name,
            endPrice: Number(etf.endPrice),
            priceChangePercentage: Number(etf.priceChangePercentage),
            chartLines: etf.chartLines
          },
          etf.ticker
        )) }),
        /* @__PURE__ */ jsx(ScrollBar, { orientation: "horizontal", className: "mb-1 px-4" })
      ] })
    ] }, key);
  }) });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Overview,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn$4(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=unchecked]:bg-neutral-200 dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950 dark:data-[state=checked]:bg-neutral-50 dark:data-[state=unchecked]:bg-neutral-800",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn$4(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:bg-neutral-950"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const DEFAULT_VIEWS = [
  { label: "Overview", value: "/overview" },
  { label: "Portfolio", value: "/portfolio" },
  { label: "Calculator", value: "/compound" }
];
function ChronoSettings() {
  const pageProps = {
    url: "chrono",
    label: "Chrono",
    labelIcon: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" })
  };
  return /* @__PURE__ */ jsx(UserProfile.Page, { ...pageProps, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium", children: "Chrono Preferences" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Customize your experience on Chrono" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "defaultView", children: "Default View" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Choose which page to show after logging in" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { defaultValue: "/overview", children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select view" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: DEFAULT_VIEWS.map((view) => /* @__PURE__ */ jsx(SelectItem, { value: view.value, children: view.label }, view.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "currency", children: "Currency" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Select your preferred currency for displaying prices" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { defaultValue: "USD", children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[100px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select currency" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "USD", children: "USD ($)" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "EUR", children: "EUR (€)" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "GBP", children: "GBP (£)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notifications", children: "Notifications" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Receive notifications about price alerts and portfolio updates" })
        ] }),
        /* @__PURE__ */ jsx(
          Switch,
          {
            className: "data-[state=checked]:bg-primary !bg-white !text-black !border-zinc-800 border-spacing-1",
            id: "notifications"
          }
        )
      ] })
    ] })
  ] }) });
}
function ProfilePage() {
  return /* @__PURE__ */ jsx("div", { className: "mt-8 mx-auto max-w-4xl", children: /* @__PURE__ */ jsx(UserProfile, { children: /* @__PURE__ */ jsx(
    UserProfile.Page,
    {
      url: "chrono",
      label: "Chrono",
      labelIcon: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }),
      children: /* @__PURE__ */ jsx(ChronoSettings, {})
    }
  ) }) });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProfilePage
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  return {};
};
function Index() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) {
    return /* @__PURE__ */ jsx("p", { children: "Loading..." });
  }
  if (isSignedIn) {
    window.location.href = "/overview";
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(UserButton, {}),
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: "Welcome back!" })
  ] });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function ActivePoint({
  currentSlice,
  ...props
}) {
  const theme = zt();
  return /* @__PURE__ */ jsx("g", { children: currentSlice == null ? void 0 : currentSlice.points.map((point2) => /* @__PURE__ */ jsx(
    vn$1,
    {
      x: point2.x,
      y: point2.y,
      datum: point2.data,
      symbol: props.pointSymbol,
      size: 12,
      color: point2.borderColor,
      borderWidth: props.pointBorderWidth,
      borderColor: point2.color,
      label: point2.label,
      labelYOffset: props.pointLabelYOffset,
      theme
    },
    point2.id
  )) });
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn$4(
        "shrink-0 bg-neutral-200 dark:bg-neutral-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const MotionNumberFlow = motion.create(NumberFlow);
const MotionArrowUp = motion.create(ArrowUp);
function PriceWithDiff({ value, diff }) {
  const canAnimate = useCanAnimate();
  return /* @__PURE__ */ jsxs(
    "span",
    {
      style: { "--number-flow-char-height": "0.85em" },
      className: "flex items-center gap-2",
      children: [
        /* @__PURE__ */ jsx(
          NumberFlow,
          {
            value,
            className: "~text-xl/4xl font-semibold",
            format: { style: "currency", currency: "USD" }
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.span,
          {
            animate: { backgroundColor: diff > 0 ? "#34d399" : "#ef4444" },
            initial: false,
            className: "~text-base/2xl inline-flex items-center px-[0.3em] text-white",
            style: { borderRadius: 999 },
            layout: canAnimate,
            transition: { layout: { duration: 0.9, bounce: 0, type: "spring" } },
            children: [
              /* @__PURE__ */ jsx(
                MotionArrowUp,
                {
                  className: "mr-0.5 size-[0.75em]",
                  absoluteStrokeWidth: true,
                  strokeWidth: 3,
                  transition: { rotate: { type: "spring", duration: 0.5, bounce: 0 } },
                  animate: { rotate: diff > 0 ? 0 : -180 },
                  initial: false
                }
              ),
              /* @__PURE__ */ jsx(
                MotionNumberFlow,
                {
                  value: diff,
                  className: "font-semibold",
                  format: { style: "percent", maximumFractionDigits: 2 },
                  style: { "--number-flow-mask-height": "0.3em" },
                  layout: canAnimate,
                  layoutRoot: canAnimate
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn$4(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn$4(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn$4(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn$4(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn$4("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn$4("text-sm text-neutral-500 dark:text-neutral-400", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("button", { ref, className: cn$4(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = "AlertDialogAction";
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn$4(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
function EtfTransactionPanel({ symbol, price }) {
  const { isLoaded, user } = useUser();
  const [investType, setInvestType] = React.useState(
    "shares"
  );
  const [amount, setAmount] = React.useState("");
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [transactionStatus, setTransactionStatus] = React.useState(null);
  const fetcher = useFetcher();
  const estimatedCost = React.useMemo(() => {
    if (!amount) return 0;
    return investType === "shares" ? Number(amount) * price : Number(amount);
  }, [amount, investType, price]);
  const estimatedShares = React.useMemo(() => {
    if (!amount) return 0;
    return investType === "shares" ? Number(amount) : Number(amount) / price;
  }, [amount, investType, price]);
  const handleInvestTypeChange = (value) => {
    setInvestType(value);
    setAmount("");
  };
  const handleBuyClick = (e3) => {
    e3.preventDefault();
    setShowConfirmDialog(true);
  };
  const handleConfirmTransaction = () => {
    setTransactionStatus("pending");
    fetcher.submit(
      {
        ticker: symbol,
        type: "BUY",
        shares: estimatedShares,
        pricePerShare: price,
        totalAmount: estimatedCost
      },
      { method: "POST", action: "/api/transaction" }
    );
  };
  React.useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      setTransactionStatus("success");
    }
  }, [fetcher.data, fetcher.state]);
  return /* @__PURE__ */ jsxs(Card, { className: "w-[450px] bg-zinc-900 text-white border-zinc-800", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-zinc-800", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Buy ",
        symbol
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: (e3) => e3.preventDefault(), children: [
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "investType", children: "Invest In" }),
          /* @__PURE__ */ jsxs(Select, { value: investType, onValueChange: handleInvestTypeChange, children: [
            /* @__PURE__ */ jsx(
              SelectTrigger,
              {
                id: "investType",
                className: "bg-zinc-900 border-zinc-700",
                children: /* @__PURE__ */ jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxs(SelectContent, { className: "bg-zinc-900 border-zinc-700", children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "shares", children: "Shares" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "dollars", children: "Dollars" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "amount", children: investType === "shares" ? "Shares" : "Amount" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "amount",
                type: "number",
                placeholder: "0",
                value: amount,
                onChange: (e3) => setAmount(e3.target.value),
                className: "bg-zinc-900 border-zinc-700 pr-10"
              }
            ),
            investType === "dollars" && /* @__PURE__ */ jsx(DollarSign, { className: "absolute right-3 top-2.5 h-4 w-4 text-zinc-400" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: "Market Price" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            price.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: "Commissions" }),
          /* @__PURE__ */ jsx("span", { children: "$0.00" })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: investType === "shares" ? "Estimated Cost" : "Est. Quantity" }),
          /* @__PURE__ */ jsx("span", { children: investType === "shares" ? `$${formatPrice(estimatedCost)}` : estimatedShares.toFixed(4) })
        ] }),
        isLoaded && user ? /* @__PURE__ */ jsx(
          Button,
          {
            className: "w-full bg-neutral-900 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:hover:bg-neutral-50/90",
            size: "lg",
            onClick: handleBuyClick,
            children: "Buy"
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-400", children: [
          "Sign up for a Chrono brokerage account to buy or sell ",
          symbol,
          " ",
          "shares commission-free. Other fees may apply. See our",
          " ",
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "link",
              className: "h-auto p-0 text-sm text-neutral-900 dark:text-neutral-50",
              children: "fee schedule"
            }
          ),
          " ",
          "to learn more."
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardFooter, { className: "flex flex-col items-center", children: !isLoaded || !user ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "w-full bg-neutral-900 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:hover:bg-neutral-50/90",
            size: "lg",
            asChild: true,
            children: /* @__PURE__ */ jsx(Link, { to: "/sign-up", children: "Sign Up to Buy" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-center text-xs mt-2", children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/sign-in",
            className: "underline text-gray-400 hover:text-gray-500",
            children: "Already have a Chrono account?"
          }
        ) })
      ] }) : null })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: showConfirmDialog, onOpenChange: setShowConfirmDialog, children: /* @__PURE__ */ jsx(AlertDialogContent, { children: transactionStatus === "success" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Transaction Successful!" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Your purchase of ",
          estimatedShares.toFixed(4),
          " shares of",
          " ",
          symbol,
          " has been completed."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => setShowConfirmDialog(false), children: "Close" }),
        /* @__PURE__ */ jsx(Link, { to: "/portfolio", className: buttonVariants(), children: "View Portfolio" })
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Confirm Transaction" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "You are about to purchase ",
          estimatedShares.toFixed(4),
          " shares of ",
          symbol,
          " for $",
          formatPrice(estimatedCost),
          ". This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleConfirmTransaction,
            disabled: transactionStatus === "pending",
            children: transactionStatus === "pending" ? "Processing..." : "Confirm Purchase"
          }
        )
      ] })
    ] }) }) })
  ] });
}
const loader$1 = async ({ request }) => {
  const url = new URL(request.url);
  const ticker2 = url.searchParams.get("ticker") || "SPY";
  const timeframe = url.searchParams.get("timeframe") || "1D";
  const apiKey = process.env.POLY_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }
  let cachedData = await getCachedETFData(ticker2, timeframe);
  const isStale = await isCacheStale(ticker2, timeframe);
  let chartData2, tickerData;
  if (!cachedData || isStale) {
    console.log(`Making API query for ${ticker2}`);
    [chartData2, tickerData] = await Promise.all([
      fetchChartData(ticker2, apiKey, timeframe),
      getETFByTicker(ticker2)
    ]);
    const { chartLines, priceChange } = transformData(chartData2, timeframe);
    await upsertETFCacheData(
      ticker2,
      priceChange.endPrice,
      priceChange.percentage,
      chartLines,
      timeframe
    );
    cachedData = {
      ticker: ticker2,
      name: tickerData == null ? void 0 : tickerData.name,
      last_price: priceChange.endPrice,
      price_change_percentage: priceChange.percentage,
      chart_data: chartLines
    };
  }
  return json({
    ticker: cachedData.ticker,
    name: cachedData.name,
    endPrice: cachedData.last_price,
    priceChangePercentage: cachedData.price_change_percentage,
    chartLines: cachedData.chart_data,
    timeframe
  });
};
function ETF() {
  const {
    ticker: ticker2,
    name,
    endPrice,
    priceChangePercentage,
    chartLines,
    timeframe
  } = useLoaderData();
  const submit = useSubmit();
  const lineColor = getChartColor(priceChangePercentage);
  const handleTimeframeChange = (newTimeframe) => {
    const formData = new FormData();
    formData.append("ticker", ticker2);
    formData.append("timeframe", newTimeframe);
    submit(formData, { method: "get" });
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-slate-900 p-5", children: /* @__PURE__ */ jsx("div", { className: "mt-5", children: chartLines.length > 0 ? /* @__PURE__ */ jsxs(
    "div",
    {
      id: "container",
      className: "\r\n          h-auto flex flex-row justify-between space-x-8\r\n          ",
      children: [
        /* @__PURE__ */ jsxs("div", { id: "etf_info", className: "w-full", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              id: "chart_header",
              className: "flex flex-row justify-between items-end my-3",
              children: [
                /* @__PURE__ */ jsxs("div", { id: "titles", className: "", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-white font-semibold text-xl", children: ticker2 }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold text-m", children: name }),
                  /* @__PURE__ */ jsx(
                    PriceWithDiff,
                    {
                      value: endPrice,
                      diff: priceChangePercentage / 100
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    id: "chart_time",
                    className: "flex items-center space-x-1 text-sm",
                    children: Object.keys(TIMEFRAMES).map((key) => /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: timeframe === key ? "default" : "outline",
                          onClick: () => handleTimeframeChange(key),
                          children: key
                        }
                      ),
                      key !== "1Y" && /* @__PURE__ */ jsx(Separator, { orientation: "vertical" })
                    ] }, key))
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { id: "chart", style: { height: "35vh" }, children: /* @__PURE__ */ jsx(
            pe,
            {
              data: chartLines,
              margin: { top: 20, right: 20, bottom: 20, left: 20 },
              xScale: { type: "point" },
              yScale: {
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false
              },
              axisTop: null,
              axisRight: null,
              axisBottom: null,
              axisLeft: null,
              colors: [lineColor],
              theme: {
                ...nivoTheme,
                crosshair: {
                  line: {
                    stroke: lineColor,
                    strokeWidth: 1,
                    strokeOpacity: 0.35
                  }
                }
              },
              pointSize: 10,
              pointColor: { theme: "background" },
              pointBorderWidth: 2,
              pointBorderColor: { from: "serieColor" },
              pointLabelYOffset: -12,
              useMesh: true,
              enablePoints: false,
              enableGridX: false,
              enableGridY: false,
              isInteractive: true,
              enableSlices: "x",
              enableCrosshair: true,
              enableTouchCrosshair: true,
              animate: false,
              sliceTooltip: ({ slice }) => {
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      background: "transparent",
                      color: "#333333",
                      padding: "5px",
                      border: "1px solid #ccc"
                    },
                    children: [
                      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { style: { fontSize: "0.8rem", color: "white" }, children: slice.points[0].data.xFormatted }) }),
                      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("strong", { style: { fontSize: "1rem", color: "white" }, children: formatPrice(slice.points[0].data.yFormatted) }) })
                    ]
                  }
                );
              },
              layers: [
                "grid",
                "axes",
                "areas",
                "lines",
                "crosshair",
                "slices",
                "mesh",
                "legends",
                ActivePoint
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(EtfTransactionPanel, { symbol: ticker2, price: Number(endPrice) })
      ]
    }
  ) : /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Please use the search field above to retrieve ETF information." }) }) }) });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ETF,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }
  const reportData = await generateReportData(userId);
  return json({ reportData });
};
function PDFPreview() {
  const { reportData } = useLoaderData();
  const [PDFViewer, setPDFViewer] = useState(null);
  useEffect(() => {
    import("@react-pdf/renderer").then((module) => {
      setPDFViewer(() => module.PDFViewer);
    });
  }, []);
  if (!PDFViewer) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-screen", children: /* @__PURE__ */ jsx("div", { className: "text-lg", children: "Loading PDF viewer..." }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "w-full h-screen", children: /* @__PURE__ */ jsx(PDFViewer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsx(PortfolioReport, { data: reportData }) }) });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PDFPreview,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DqVKwQAH.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/browser-CpFPM1uB.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-Dpm_al_X.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/browser-CpFPM1uB.js", "/assets/input-DubpVVAp.js", "/assets/index-BPsMxvU-.js", "/assets/utils-BM_CldAA.js"], "css": ["/assets/root-ClnlRumu.css"] }, "routes/api.report.$userId": { "id": "routes/api.report.$userId", "parentId": "root", "path": "api/report/:userId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.report._userId-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.webhook.clerk": { "id": "routes/api.webhook.clerk", "parentId": "root", "path": "api/webhook/clerk", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.webhook.clerk-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.user.$userId": { "id": "routes/api.user.$userId", "parentId": "root", "path": "api/user/:userId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.user._userId-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.transaction": { "id": "routes/api.transaction", "parentId": "root", "path": "api/transaction", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.transaction-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/portfolio": { "id": "routes/portfolio", "parentId": "root", "path": "portfolio", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/portfolio-BGRlpsF_.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/button-CIXCo6r4.js", "/assets/format-AvGu2lEH.js", "/assets/utils-BM_CldAA.js", "/assets/PortfolioReport-BulEoNs9.js", "/assets/createLucideIcon-tJWFBsYP.js", "/assets/index-CTGCmpmz.js", "/assets/isEqual-DXEuLGZN.js"], "css": [] }, "routes/sign-in.$": { "id": "routes/sign-in.$", "parentId": "root", "path": "sign-in/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sign-in._-UpFAtNPS.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/index-BPsMxvU-.js", "/assets/browser-CpFPM1uB.js"], "css": [] }, "routes/sign-up.$": { "id": "routes/sign-up.$", "parentId": "root", "path": "sign-up/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sign-up._-aalkrQOw.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/index-BPsMxvU-.js", "/assets/browser-CpFPM1uB.js"], "css": [] }, "routes/compound": { "id": "routes/compound", "parentId": "root", "path": "compound", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/compound-Dxk0Ryl0.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/index-CTGCmpmz.js", "/assets/utils-BM_CldAA.js", "/assets/select-tmrOMQMk.js", "/assets/input-DubpVVAp.js", "/assets/button-CIXCo6r4.js", "/assets/format-AvGu2lEH.js", "/assets/nivo-line.es-Cm019bgU.js", "/assets/ChartTheme-e3M-0zx7.js", "/assets/createLucideIcon-tJWFBsYP.js", "/assets/index-BMCWBtwY.js", "/assets/isEqual-DXEuLGZN.js"], "css": [] }, "routes/overview": { "id": "routes/overview", "parentId": "root", "path": "overview", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/overview-BAa7etLq.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/format-AvGu2lEH.js", "/assets/nivo-line.es-Cm019bgU.js", "/assets/index-BdIMjnOM.js", "/assets/isEqual-DXEuLGZN.js", "/assets/index-BMCWBtwY.js", "/assets/index-CTGCmpmz.js", "/assets/utils-BM_CldAA.js"], "css": [] }, "routes/profile": { "id": "routes/profile", "parentId": "root", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile-DQFOyx5o.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/index-BPsMxvU-.js", "/assets/select-tmrOMQMk.js", "/assets/index-BMCWBtwY.js", "/assets/index-CTGCmpmz.js", "/assets/utils-BM_CldAA.js", "/assets/createLucideIcon-tJWFBsYP.js", "/assets/browser-CpFPM1uB.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-D2h5np_5.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/index-BPsMxvU-.js", "/assets/browser-CpFPM1uB.js"], "css": [] }, "routes/etf": { "id": "routes/etf", "parentId": "root", "path": "etf", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/etf-CEpDkMir.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/nivo-line.es-Cm019bgU.js", "/assets/ChartTheme-e3M-0zx7.js", "/assets/button-CIXCo6r4.js", "/assets/index-BMCWBtwY.js", "/assets/utils-BM_CldAA.js", "/assets/index-BdIMjnOM.js", "/assets/format-AvGu2lEH.js", "/assets/createLucideIcon-tJWFBsYP.js", "/assets/input-DubpVVAp.js", "/assets/select-tmrOMQMk.js", "/assets/index-BPsMxvU-.js", "/assets/index-CTGCmpmz.js", "/assets/isEqual-DXEuLGZN.js", "/assets/browser-CpFPM1uB.js"], "css": [] }, "routes/pdf": { "id": "routes/pdf", "parentId": "root", "path": "pdf", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/pdf-DQOxRp1z.js", "imports": ["/assets/components-BKT8Awtw.js", "/assets/PortfolioReport-BulEoNs9.js", "/assets/isEqual-DXEuLGZN.js"], "css": [] } }, "url": "/assets/manifest-ea870846.js", "version": "ea870846" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.report.$userId": {
    id: "routes/api.report.$userId",
    parentId: "root",
    path: "api/report/:userId",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.webhook.clerk": {
    id: "routes/api.webhook.clerk",
    parentId: "root",
    path: "api/webhook/clerk",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api.user.$userId": {
    id: "routes/api.user.$userId",
    parentId: "root",
    path: "api/user/:userId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.transaction": {
    id: "routes/api.transaction",
    parentId: "root",
    path: "api/transaction",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/portfolio": {
    id: "routes/portfolio",
    parentId: "root",
    path: "portfolio",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/sign-in.$": {
    id: "routes/sign-in.$",
    parentId: "root",
    path: "sign-in/*",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/sign-up.$": {
    id: "routes/sign-up.$",
    parentId: "root",
    path: "sign-up/*",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/compound": {
    id: "routes/compound",
    parentId: "root",
    path: "compound",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/overview": {
    id: "routes/overview",
    parentId: "root",
    path: "overview",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route11
  },
  "routes/etf": {
    id: "routes/etf",
    parentId: "root",
    path: "etf",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/pdf": {
    id: "routes/pdf",
    parentId: "root",
    path: "pdf",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
