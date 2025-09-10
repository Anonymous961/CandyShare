import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms and Conditions - CandyShare',
    description: 'Terms and conditions for using CandyShare file sharing service.',
};

export default function TermsConditionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing and using CandyShare (&quot;the Service&quot;), you accept and agree to be bound by the terms
                                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
                            <p className="text-gray-600 mb-4">
                                CandyShare is a digital file sharing service that allows users to upload, store, and share files
                                securely. The service includes both free and premium features.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>You must provide accurate and complete information when creating an account</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You must notify us immediately of any unauthorized use of your account</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Acceptable Use Policy</h2>
                            <div className="bg-red-50 p-6 rounded-lg mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Uploading illegal, harmful, or malicious content</li>
                                    <li>Violating intellectual property rights</li>
                                    <li>Attempting to gain unauthorized access to our systems</li>
                                    <li>Using the service for spam or unsolicited communications</li>
                                    <li>Uploading content that violates any applicable laws or regulations</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. File Storage and Retention</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Free accounts: Files are retained for 7 days</li>
                                <li>Pro accounts: Files are retained for 30 days</li>
                                <li>Files may be deleted after the retention period without notice</li>
                                <li>We are not responsible for data loss due to system failures or user error</li>
                                <li>Users are responsible for backing up important files</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Payment and Billing</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Subscription fees are billed monthly in advance</li>
                                <li>All payments are processed securely through Razorpay</li>
                                <li>Prices are subject to change with 30 days notice</li>
                                <li>Failed payments may result in service suspension</li>
                                <li>Refunds are subject to our refund policy</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy and Data Protection</h2>
                            <p className="text-gray-600 mb-4">
                                Your privacy is important to us. Please review our{' '}
                                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>{' '}
                                to understand how we collect, use, and protect your information.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Intellectual Property</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>You retain ownership of files you upload</li>
                                <li>You grant us a license to store and serve your files</li>
                                <li>Our service, including software and trademarks, is protected by intellectual property laws</li>
                                <li>You may not reverse engineer or copy our service</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Service Availability</h2>
                            <p className="text-gray-600 mb-4">
                                While we strive for high availability, we cannot guarantee uninterrupted service.
                                We may perform maintenance, updates, or modifications that temporarily affect service availability.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Limitation of Liability</h2>
                            <p className="text-gray-600 mb-4">
                                To the maximum extent permitted by law, CandyShare shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages, including but not limited to
                                loss of profits, data, or other intangible losses.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Termination</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>You may terminate your account at any time</li>
                                <li>We may terminate your account for violations of these terms</li>
                                <li>Upon termination, your files may be deleted</li>
                                <li>Provisions that by their nature should survive termination shall remain in effect</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Changes to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify these terms at any time. We will notify users of
                                significant changes via email or through the service. Continued use of the service
                                after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Governing Law</h2>
                            <p className="text-gray-600 mb-4">
                                These terms shall be governed by and construed in accordance with the laws of the
                                jurisdiction in which CandyShare operates, without regard to conflict of law principles.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Contact Information</h2>
                            <p className="text-gray-600">
                                If you have any questions about these Terms and Conditions, please contact us at{' '}
                                <a href="mailto:legal@candyshare.com" className="text-blue-600 hover:underline">
                                    legal@candyshare.com
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
