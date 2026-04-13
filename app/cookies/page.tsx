import Head from 'next/head';

export default function CookiesPolicy() {
  return (
    <>
      <Head>
        <title>Cookies Policy - {process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="description" content="Learn how watchz uses cookies to enhance your browsing experience." />
      </Head>
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-bold mb-4">Cookies Policy</h1>
        <p>Last updated: February 21, 2025</p>
        <p>
          This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can
          understand what type of cookies We use, the information We collect using Cookies, and how that information is
          used.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Interpretation and Definitions</h2>
        <h3 className="text-2xl font-semibold mt-4">Interpretation</h3>
        <p>The words with capitalized initials have meanings as defined below, regardless of singular or plural usage.</p>
        <h3 className="text-2xl font-semibold mt-4">Definitions</h3>
        <ul className="list-disc ml-6">
          <li>
            <strong>Company:</strong> Refers to watchz ("the Company", "We", "Us", or "Our").
          </li>
          <li>
            <strong>Cookies:</strong> Small files placed on Your device, containing browsing history details among other
            uses.
          </li>
          <li>
            <strong>Website:</strong> Refers to watchz, accessible from
            <a href="https://watchz.in" target="_blank" rel="noopener noreferrer" className="text-blue-500"> watchz.in</a>.
          </li>
          <li>
            <strong>You:</strong> The individual or legal entity accessing or using the Website.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">The Use of Cookies</h2>
        <h3 className="text-2xl font-semibold mt-4">Types of Cookies We Use</h3>
        <ul className="list-disc ml-6">
          <li>
            <p><strong>Necessary / Essential Cookies</strong></p>
            <p>Type: Session Cookies</p>
            <p>Purpose: These are required for essential website functionality like authentication and security.</p>
          </li>
          <li>
            <p><strong>Functionality Cookies</strong></p>
            <p>Type: Persistent Cookies</p>
            <p>Purpose: Used to remember your preferences and settings, providing a better browsing experience.</p>
          </li>
        </ul>
        <h3 className="text-2xl font-semibold mt-4">Your Choices Regarding Cookies</h3>
        <p>
          If You prefer to avoid the use of Cookies, disable them in your browser settings and delete stored Cookies. If
          You decline Cookies, some Website features may not function properly.
        </p>
        <h3 className="text-2xl font-semibold mt-4">More Information about Cookies</h3>
        <p>
          Learn more about cookies here:
          <a
            href="https://www.termsfeed.com/blog/cookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            All About Cookies by TermsFeed
          </a>
          .
        </p>
        <h3 className="text-2xl font-semibold mt-4">Contact Us</h3>
        <p>
          If you have any questions about this Cookies Policy, contact us at:
          <a
            href="https://watchz.in/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            watchz.in/contact
          </a>
          .
        </p>
      </div>
    </>
  );
}
