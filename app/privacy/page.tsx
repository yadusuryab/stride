import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <head>
        <title>Privacy Policy - {process.env.NEXT_PUBLIC_APP_NAME} Store</title>
        <meta name="description" content={`Read the privacy policy of ${process.env.NEXT_PUBLIC_APP_NAME} Store to understand how we handle your data.`} />
      </head>
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
        <p>At {process.env.NEXT_PUBLIC_APP_NAME} Store, we are dedicated to protecting your privacy and securing the personal information you provide. This Privacy Policy outlines our practices regarding the collection, use, and sharing of your data when you visit our website or make purchases.</p>

        <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
        <ul className="list-disc ml-6">
          <li><strong>Name:</strong> Your full name, used for processing and fulfilling your orders.</li>
          <li><strong>Phone Number:</strong> Used to communicate with you about your order status, provide updates, and offer customer support.</li>
          <li><strong>Address:</strong> Your shipping address, including City, State, and Pin Code, to ensure accurate delivery.</li>
          <li><strong>Instagram ID:</strong> Collected only if provided by you, to engage with you on social media platforms.</li>
          <li><strong>Additional Information:</strong> Any other details you voluntarily choose to share with us to improve your shopping experience.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6">
          <li><strong>Order Processing:</strong> To process and fulfill your orders accurately and efficiently.</li>
          <li><strong>Customer Communication:</strong> To send you order confirmations, status updates, and respond to your inquiries.</li>
          <li><strong>Service Improvement:</strong> To analyze user behavior, helping us enhance our website, products, and overall shopping experience.</li>
          <li><strong>Marketing:</strong> To send promotional materials and special offers, if you have opted to receive such communications.</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">3. Sharing Your Information</h2>
        <p>Your privacy is important to us. We may share your personal information with trusted third parties only in the following situations:</p>
        <ul className="list-disc ml-6">
          <li><strong>Suppliers:</strong> Necessary information shared with our suppliers to fulfill your orders.</li>
          <li><strong>Service Providers:</strong> Third-party providers for payment processing, shipping, and other essential functions.</li>
          <li><strong>Legal Requirements:</strong> Disclosures made when required by law or in response to valid requests from public authorities.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">4. Data Security</h2>
        <p>We use a range of security measures to protect your personal information from unauthorized access, use, or disclosure. These include encryption, firewalls, and secure server hosting.</p>

        <h2 className="text-2xl font-semibold mt-6">5. Your Rights</h2>
        <ul className="list-disc ml-6">
          <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
          <li><strong>Correction:</strong> Request corrections to inaccuracies in your personal data.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal exceptions.</li>
          <li><strong>Opt-Out:</strong> Opt-out of receiving marketing communications.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">6. Changes to the Privacy Policy</h2>
        <p>We may update this Privacy Policy periodically. Updates will be posted on this page.</p>

        <h2 className="text-2xl font-semibold mt-6">7. Third-Party Links</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these sites.</p>

        <h2 className="text-2xl font-semibold mt-6">8. Children's Privacy</h2>
        <p>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.</p>
      </div>
    </>
  );
}
