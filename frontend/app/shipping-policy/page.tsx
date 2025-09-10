import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping Policy - CandyShare',
    description: 'Information about digital file delivery and service availability for CandyShare.',
};

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Digital Service Delivery</h2>
                            <p className="text-gray-600 mb-4">
                                CandyShare is a digital file sharing service. Since we deal exclusively with digital content,
                                there are no physical products to ship. This policy outlines how our digital services are delivered.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Availability</h2>
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Access</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>File uploads are processed immediately upon successful payment</li>
                                    <li>Download links are generated instantly</li>
                                    <li>No waiting periods or processing delays</li>
                                    <li>24/7 service availability worldwide</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Geographic Availability</h2>
                            <p className="text-gray-600 mb-4">
                                Our service is available globally with the following considerations:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Service available in all countries where internet access is permitted</li>
                                <li>Compliance with local data protection and privacy laws</li>
                                <li>Some features may be restricted based on regional regulations</li>
                                <li>Payment processing subject to local banking and financial regulations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Delivery Methods</h2>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">File Sharing</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Secure HTTPS links for file downloads</li>
                                        <li>QR code generation for easy sharing</li>
                                        <li>Password protection options</li>
                                        <li>Expiration date management</li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Access</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Immediate account activation upon signup</li>
                                        <li>Instant access to dashboard and features</li>
                                        <li>Real-time analytics and file management</li>
                                        <li>Email notifications for account activities</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technical Requirements</h2>
                            <p className="text-gray-600 mb-4">
                                To access our services, you need:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Internet connection (minimum 1 Mbps recommended)</li>
                                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                                <li>JavaScript enabled in your browser</li>
                                <li>Sufficient storage space for file downloads</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Interruptions</h2>
                            <p className="text-gray-600 mb-4">
                                While we strive for 99.9% uptime, occasional service interruptions may occur due to:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Scheduled maintenance (with advance notice)</li>
                                <li>Technical issues or server problems</li>
                                <li>Third-party service dependencies</li>
                                <li>Force majeure events</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                We will notify users of planned maintenance at least 24 hours in advance whenever possible.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                            <p className="text-gray-600">
                                If you experience any issues with service delivery, please contact us at{' '}
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
