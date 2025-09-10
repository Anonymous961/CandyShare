import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - CandyShare',
    description: 'Privacy policy and data protection information for CandyShare file sharing service.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Email address (for account creation and communication)</li>
                                        <li>Name (if provided during registration)</li>
                                        <li>Payment information (processed securely through Razorpay)</li>
                                        <li>Account preferences and settings</li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Information</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Files you upload and their metadata</li>
                                        <li>Download activity and analytics</li>
                                        <li>IP address and device information</li>
                                        <li>Browser type and version</li>
                                        <li>Usage patterns and feature interactions</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>To provide and maintain our file sharing service</li>
                                <li>To process payments and manage subscriptions</li>
                                <li>To communicate with you about your account and service updates</li>
                                <li>To improve our service and develop new features</li>
                                <li>To ensure security and prevent abuse</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing and Disclosure</h2>
                            <div className="bg-yellow-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">We Do Not Sell Your Data</h3>
                                <p className="text-gray-600">
                                    We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Limited Sharing</h3>
                            <p className="text-gray-600 mb-4">We may share your information only in the following circumstances:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>With payment processors (Razorpay) to process transactions</li>
                                <li>With cloud storage providers to store your files securely</li>
                                <li>When required by law or legal process</li>
                                <li>To protect our rights, property, or safety</li>
                                <li>With your explicit consent</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
                            <div className="bg-green-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Security Measures</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>All data transmission is encrypted using HTTPS/TLS</li>
                                    <li>Files are stored securely in encrypted cloud storage</li>
                                    <li>Access controls and authentication systems protect your data</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Secure payment processing through certified providers</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Retention</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Account information: Retained while your account is active</li>
                                <li>Uploaded files: Retained according to your plan (7 days for free, 30 days for Pro)</li>
                                <li>Usage analytics: Retained for up to 2 years for service improvement</li>
                                <li>Payment records: Retained as required by law (typically 7 years)</li>
                                <li>Deleted data: Permanently removed from our systems within 30 days</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights and Choices</h2>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Access and Control</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Access your personal information through your account dashboard</li>
                                        <li>Update or correct your information at any time</li>
                                        <li>Download your data in a portable format</li>
                                        <li>Delete your account and associated data</li>
                                    </ul>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Communication Preferences</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Opt out of promotional emails (account-related emails will continue)</li>
                                        <li>Manage notification preferences in your account settings</li>
                                        <li>Unsubscribe from marketing communications</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cookies and Tracking</h2>
                            <p className="text-gray-600 mb-4">
                                We use cookies and similar technologies to:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Remember your login status and preferences</li>
                                <li>Analyze usage patterns to improve our service</li>
                                <li>Provide personalized features and content</li>
                                <li>Ensure security and prevent fraud</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                You can control cookie settings through your browser, but some features may not work properly
                                if cookies are disabled.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. International Data Transfers</h2>
                            <p className="text-gray-600 mb-4">
                                Your data may be transferred to and processed in countries other than your own.
                                We ensure appropriate safeguards are in place to protect your data in accordance
                                with applicable data protection laws.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Children&apos;s Privacy</h2>
                            <p className="text-gray-600 mb-4">
                                Our service is not intended for children under 13 years of age. We do not knowingly
                                collect personal information from children under 13. If we become aware that we have
                                collected personal information from a child under 13, we will take steps to delete such information.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to This Policy</h2>
                            <p className="text-gray-600 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any material
                                changes by email or through our service. Your continued use of the service after changes
                                constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Us</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <ul className="list-none text-gray-600 space-y-2">
                                    <li>Email: <a href="mailto:privacy@candyshare.com" className="text-blue-600 hover:underline">privacy@candyshare.com</a></li>
                                    <li>Support: <a href="mailto:support@candyshare.com" className="text-blue-600 hover:underline">support@candyshare.com</a></li>
                                </ul>
                            </div>
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
