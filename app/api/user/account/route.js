import dbConnect from "../../../../lib/mongoose";
import User from "../../../../models/User";

// Handle GET requests
export async function GET(req) {
  await dbConnect();
  const userId = "67813eb85712ee7896043f77"; // Example User ID, replace this with dynamic logic

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ accounts: user.accounts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Handle POST requests
export async function POST(req) {
  await dbConnect();
  const userId = "67813eb85712ee7896043f77"; // Example User ID, replace this with dynamic logic

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const { name } = body;

  // Validate input
  if (!name) {
    return new Response(JSON.stringify({ error: "Account name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if the account already exists
  if (user.accounts.some((account) => account.name === name)) {
    return new Response(JSON.stringify({ error: "Account already exists" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Add the new account
  user.accounts.push({ name, balance: 0 });
  await user.save();

  return new Response(JSON.stringify({ accounts: user.accounts }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// Handle DELETE requests
export async function DELETE(req) {
  await dbConnect();
  const userId = "67813eb85712ee7896043f77"; // Example User ID, replace this with dynamic logic

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const { name } = body;

  // Validate input
  if (!name) {
    return new Response(JSON.stringify({ error: "Account name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Remove the account
  user.accounts = user.accounts.filter((account) => account.name !== name);
  await user.save();

  return new Response(JSON.stringify({ accounts: user.accounts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
