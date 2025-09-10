import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();

// Initialize Razorpay with test mode
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create one-time payment order (for PayPal and other international payments)
router.post("/create-order", async (req, res) => {
    try {
        const { userId, tier } = req.body;
        
        if (!userId || !tier) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Define pricing
        const pricing = {
            PRO: 899, // $8.99 in cents
        };

        const amount = pricing[tier as keyof typeof pricing];
        if (!amount) {
            return res.status(400).json({ error: "Invalid tier" });
        }

        // Create a shorter receipt (max 40 characters)
        const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
        const receipt = `cs_${tier}_${timestamp}`; // candyshare_pro_12345678

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "USD",
            receipt: receipt,
            notes: {
                userId,
                tier,
            },
        });

        // Store payment record
        const payment = await prisma.payment.create({
            data: {
                userId,
                razorpayOrderId: order.id,
                amount,
                currency: "USD",
                tier: tier as any,
                status: "PENDING",
            },
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            paymentId: payment.id,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create payment order" });
    }
});

// Verify one-time payment
router.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !paymentId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        // Update payment status
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                razorpayPaymentId: razorpay_payment_id,
                status: "COMPLETED",
            },
            include: { user: true },
        });

        // Update user tier
        await prisma.user.update({
            where: { id: payment.userId },
            data: { tier: "PRO" },
        });

        // Create subscription record for tracking (manual subscription)
        await prisma.subscription.create({
            data: {
                userId: payment.userId,
                razorpaySubscriptionId: `manual_${paymentId}`,
                tier: "PRO",
                status: "ACTIVE",
                amount: payment.amount,
                currency: payment.currency,
                billingCycle: "MONTHLY",
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

// Create subscription plan (for future use when webhooks are available)
router.post("/create-plan", async (req, res) => {
    try {
        const plan = await razorpay.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: "CandyShare Pro Monthly",
                amount: 899, // $8.99 in cents
                currency: "USD",
                description: "Pro tier subscription for CandyShare"
            },
            notes: {
                tier: "PRO"
            }
        });

        res.json({ planId: plan.id });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({ error: "Failed to create subscription plan" });
    }
});

// Create subscription (for future use when webhooks are available)
router.post("/create-subscription", async (req, res) => {
    try {
        const { userId, planId } = req.body;
        
        if (!userId || !planId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create Razorpay subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            quantity: 1,
            total_count: 12, // 12 months
            notes: {
                userId,
                tier: "PRO"
            }
        });

        // Store subscription record
        const dbSubscription = await prisma.subscription.create({
            data: {
                userId,
                razorpaySubscriptionId: subscription.id,
                tier: "PRO",
                status: "ACTIVE",
                amount: 899, // $8.99 in cents
                currency: "USD",
                billingCycle: "MONTHLY",
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        res.json({
            subscriptionId: subscription.id,
            short_url: subscription.short_url,
            status: subscription.status,
            dbSubscriptionId: dbSubscription.id,
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Failed to create subscription" });
    }
});

// Verify subscription payment (for future use)
router.post("/verify-subscription", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, subscriptionId } = req.body;

        if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature || !subscriptionId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Verify signature
        const body = razorpay_subscription_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        // Update subscription status
        const subscription = await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: "ACTIVE",
            },
            include: { user: true },
        });

        // Update user tier
        await prisma.user.update({
            where: { id: subscription.userId },
            data: { tier: "PRO" },
        });

        // Create payment record
        await prisma.payment.create({
            data: {
                userId: subscription.userId,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySubscriptionId: razorpay_subscription_id,
                amount: subscription.amount,
                currency: subscription.currency,
                tier: "PRO",
                status: "COMPLETED",
                subscriptionType: "RECURRING",
            },
        });

        res.json({ success: true, message: "Subscription verified successfully" });
    } catch (error) {
        console.error("Error verifying subscription:", error);
        res.status(500).json({ error: "Subscription verification failed" });
    }
});

// Webhook handler for subscription events (for future use)
router.post("/webhook", async (req, res) => {
    try {
        const body = JSON.stringify(req.body);
        const signature = req.headers["x-razorpay-signature"] as string;

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        const event = req.body;

        switch (event.event) {
            case "subscription.charged":
                await handleSubscriptionCharged(event);
                break;
            case "subscription.cancelled":
                await handleSubscriptionCancelled(event);
                break;
            case "subscription.paused":
                await handleSubscriptionPaused(event);
                break;
            case "subscription.resumed":
                await handleSubscriptionResumed(event);
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
});

// Helper functions for webhook events
async function handleSubscriptionCharged(event: any) {
    const { subscription_id, payment_id } = event.payload.subscription.entity;
    
    // Update subscription
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription_id },
        data: {
            status: "ACTIVE",
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    // Create payment record
    const subscription = await prisma.subscription.findFirst({
        where: { razorpaySubscriptionId: subscription_id },
    });

    if (subscription) {
        await prisma.payment.create({
            data: {
                userId: subscription.userId,
                razorpayPaymentId: payment_id,
                razorpaySubscriptionId: subscription_id,
                amount: subscription.amount,
                currency: subscription.currency,
                tier: "PRO",
                status: "COMPLETED",
                subscriptionType: "RECURRING",
            },
        });
    }
}

async function handleSubscriptionCancelled(event: any) {
    const { subscription_id } = event.payload.subscription.entity;
    
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription_id },
        data: {
            status: "CANCELLED",
        },
    });
}

async function handleSubscriptionPaused(event: any) {
    const { subscription_id } = event.payload.subscription.entity;
    
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription_id },
        data: {
            status: "PAUSED",
        },
    });
}

async function handleSubscriptionResumed(event: any) {
    const { subscription_id } = event.payload.subscription.entity;
    
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription_id },
        data: {
            status: "ACTIVE",
        },
    });
}

// Get subscription status
router.get("/subscription/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const subscription = await prisma.subscription.findFirst({
            where: { 
                userId,
                status: { in: ["ACTIVE", "PAUSED"] }
            },
            orderBy: { createdAt: "desc" },
        });

        res.json(subscription);
    } catch (error) {
        console.error("Error fetching subscription:", error);
        res.status(500).json({ error: "Failed to fetch subscription" });
    }
});

// Cancel subscription
router.post("/cancel-subscription/:subscriptionId", async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });

        if (!subscription) {
            return res.status(404).json({ error: "Subscription not found" });
        }

        // For manual subscriptions, just update the status
        if (subscription.razorpaySubscriptionId.startsWith('manual_')) {
            await prisma.subscription.update({
                where: { id: subscriptionId },
                data: { status: "CANCELLED" },
            });
        } else {
            // Cancel in Razorpay for real subscriptions
            await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);
            
            // Update in database
            await prisma.subscription.update({
                where: { id: subscriptionId },
                data: { status: "CANCELLED" },
            });
        }

        res.json({ success: true, message: "Subscription cancelled" });
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ error: "Failed to cancel subscription" });
    }
});

export default router;