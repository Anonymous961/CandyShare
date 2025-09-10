import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing Policy - CandyShare',
    description: 'Our pricing policy and subscription terms for CandyShare file sharing service.',
};

export default function PricingPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Pricing Policy</h1>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subscription Plans</h2>
                            <p className="text-gray-600 mb-4">
                                CandyShare offers both free and premium subscription plans to meet different user needs.
                            </p>

                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Free Plan</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Up to 5 file uploads per day</li>
                                    <li>Maximum file size: 200MB</li>
                                    <li>7-day file retention</li>
                                    <li>Standard support</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pro Plan - $8.99/month</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Unlimited file uploads</li>
                                    <li>Maximum file size: 2GB</li>
                                    <li>30-day file retention</li>
                                    <li>Advanced analytics and insights</li>
                                    <li>Priority support</li>
                                    <li>Custom branding options</li>
                                    <li>Password protection for files</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Terms</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>All prices are in USD and exclude applicable taxes</li>
                                <li>Subscriptions are billed monthly in advance</li>
                                <li>Payment is processed securely through Razorpay</li>
                                <li>We accept major credit cards, debit cards, and digital wallets</li>
                                <li>Failed payments may result in service suspension</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Price Changes</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify our pricing at any time. For existing subscribers:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Price changes will be communicated 30 days in advance</li>
                                <li>Current subscribers will be grandfathered at their current rate for 3 months</li>
                                <li>You may cancel your subscription before the new pricing takes effect</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refunds and Cancellations</h2>
                            <p className="text-gray-600 mb-4">
                                Please refer to our <a href="/refund-policy" className="text-blue-600 hover:underline">Cancellation/Refund Policy</a> for detailed information about refunds and subscription cancellations.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                            <p className="text-gray-600">
                                If you have any questions about our pricing policy, please contact us at{' '}
                                <a href="mailto:support@candyshare.com" className="text-blue-600 hover:underline">
                                    support@candyshare.com
                                </a>
                            </p>
                        </section>

                        <div className="text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
                            <p>Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
