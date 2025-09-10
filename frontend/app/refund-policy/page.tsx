import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cancellation/Refund Policy - CandyShare',
    description: 'Cancellation and refund policy for CandyShare subscription services.',
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Cancellation/Refund Policy</h1>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Subscription Cancellation</h2>
                            <div className="bg-blue-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Cancel</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Log into your account dashboard</li>
                                    <li>Navigate to the &quot;Billing&quot; or &quot;Subscription&quot; section</li>
                                    <li>Click &quot;Cancel Subscription&quot; and follow the prompts</li>
                                    <li>Contact support at support@candyshare.com if you need assistance</li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Cancellation Terms</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>You can cancel your subscription at any time</li>
                                <li>Cancellation takes effect at the end of your current billing period</li>
                                <li>You will retain Pro features until the end of your paid period</li>
                                <li>No cancellation fees apply</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Refund Policy</h2>
                            <div className="bg-green-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">30-Day Money-Back Guarantee</h3>
                                <p className="text-gray-600 mb-4">
                                    We offer a 30-day money-back guarantee for new subscribers. If you&apos;re not satisfied
                                    with our Pro service within the first 30 days, we&apos;ll provide a full refund.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Eligibility</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Refunds are available within 30 days of initial subscription</li>
                                <li>Refunds are available within 7 days of any subscription renewal</li>
                                <li>Refunds are not available for partial months of service</li>
                                <li>Refunds are not available for accounts that violate our Terms of Service</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Refund Process</h2>
                            <div className="space-y-4">
                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Step 1: Request Refund</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Contact us at refunds@candyshare.com</li>
                                        <li>Include your account email and reason for refund</li>
                                        <li>We&apos;ll respond within 24 hours</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Step 2: Processing</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>We&apos;ll review your request within 2 business days</li>
                                        <li>If approved, we&apos;ll process the refund immediately</li>
                                        <li>Refunds are processed through the original payment method</li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Step 3: Confirmation</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>You&apos;ll receive email confirmation of the refund</li>
                                        <li>Refund appears in your account within 5-10 business days</li>
                                        <li>Your subscription will be cancelled automatically</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Partial Refunds</h2>
                            <p className="text-gray-600 mb-4">
                                In certain circumstances, we may offer partial refunds:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Service outages lasting more than 24 hours</li>
                                <li>Significant feature changes that affect your use case</li>
                                <li>Billing errors on our part</li>
                                <li>Technical issues that prevent normal service usage</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Non-Refundable Items</h2>
                            <div className="bg-red-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Items Not Eligible for Refund</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Usage-based charges (file uploads, downloads)</li>
                                    <li>Third-party fees (payment processing fees)</li>
                                    <li>Custom development or integration services</li>
                                    <li>Accounts terminated for Terms of Service violations</li>
                                    <li>Refunds requested after the 30-day guarantee period</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Subscription Downgrades</h2>
                            <p className="text-gray-600 mb-4">
                                If you want to downgrade from Pro to Free plan:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Downgrades take effect at the end of your current billing period</li>
                                <li>You&apos;ll retain Pro features until the period ends</li>
                                <li>No refund is provided for unused time</li>
                                <li>Files exceeding free plan limits may be deleted</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Chargebacks and Disputes</h2>
                            <p className="text-gray-600 mb-4">
                                If you initiate a chargeback or dispute with your payment provider:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>We&apos;ll investigate the dispute and provide evidence to your bank</li>
                                <li>Your account may be suspended during the investigation</li>
                                <li>We may require additional verification for future payments</li>
                                <li>Please contact us first to resolve any billing issues</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Data After Cancellation</h2>
                            <div className="bg-gray-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">What Happens to Your Data</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Your files remain accessible until their expiration date</li>
                                    <li>Account data is retained for 90 days after cancellation</li>
                                    <li>You can reactivate your account within 90 days</li>
                                    <li>After 90 days, all data is permanently deleted</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
                            <p className="text-gray-600 mb-4">
                                For refund requests, cancellations, or billing questions:
                            </p>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <ul className="list-none text-gray-600 space-y-2">
                                    <li>Email: <a href="mailto:refunds@candyshare.com" className="text-blue-600 hover:underline">refunds@candyshare.com</a></li>
                                    <li>Support: <a href="mailto:support@candyshare.com" className="text-blue-600 hover:underline">support@candyshare.com</a></li>
                                    <li>Response time: Within 24 hours</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Policy Changes</h2>
                            <p className="text-gray-600 mb-4">
                                We may update this refund policy from time to time. Changes will be posted on this page
                                and communicated to active subscribers via email. Continued use of our service after
                                changes constitutes acceptance of the updated policy.
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
