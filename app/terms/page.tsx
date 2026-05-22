import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6  rounded-lg">
      <head>
        <title>Terms and Conditions - {process.env.NEXT_PUBLIC_APP_NAME} Store</title>
        <meta name="description" content={`Terms and conditions of ${process.env.NEXT_PUBLIC_APP_NAME} store.`} />
      </head>
      <h2 className="text-2xl font-bold text-center mb-4">
        TERMS & CONDITIONS
      </h2>

      <section className="mb-6">
        <h3 className="text-2xl font-semibold">RETURN & REPLACEMENT POLICY</h3>
        <ul className="list-disc ml-6 mt-2">
          <li>
            You can return the product for a replacement if the product is the
            wrong size, incorrect, or damaged.
          </li>
          <li>
            We do not offer exchanges, returns, or refunds for reasons related
            to personal preferences or dislikes. We strive to provide the best,
            but individual tastes and preferences may vary.
          </li>
        </ul>
        <p className="mt-2">
          Refunds are not available, only replacements. However, if the product
          is lost by the courier service, a refund is applicable under specific
          conditions.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-semibold">UNBOXING VIDEO REQUIREMENTS</h3>
        <ul className="list-disc ml-6 mt-2">
          <li>
            A 360-degree video of unboxing the parcel is mandatory for any
            claims related to damage, size incorrect, missing items, etc. The
            issue must be clearly shown in the video without any pauses or cuts.
            This must be reported within 24 hours of receiving the parcel.
          </li>
          <li>
            The video should begin by showing the address label as sent by us,
            including the outer packaging.
          </li>
        </ul>
        <p className="mt-2">
          Some customers forget to take an unboxing video and later create fake
          videos. We do not accept such videos as proof. All customers must
          follow our guidelines.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-semibold">IMPORTANT NOTES</h3>
        <ul className="list-disc ml-6 mt-2">
          <li>
            Slight color variation or light/dark differences due to digital
            photography or device screen settings may occur. Therefore, images
            shown may differ slightly from the actual product.
          </li>
          <li>
            Minor issues like loose threads, removable stains, or slight
            stitching imperfections are not considered damages.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-semibold">*KEEP IN MIND</h3>
        <ul className="list-disc ml-6 mt-2">
          <li>Cancellation is not allowed after placing the order.</li>
          <li>
            If you want to replace a product, you must bear the courier charges.
            If the issue is from our side, we will cover the courier cost only
            after you provide the dispatch slip.
          </li>
          <li>The quality of the product is based on the price you pay.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-semibold">SHIPPING & DELIVERY </h3>
        <ul className="list-disc ml-6 mt-2">
          <li>We are not the owners of any courier services.</li>
          <li>
            We send parcels through third-party courier services. If there is
            any delay in delivery, we are not responsible as it is beyond our
            control. However, 24x7 support is available from our side with 100%
            effort to resolve the issue. If the issue remains unresolved, it
            will be handled through mutual discussion.
          </li>
          <li>
            Do not request refunds or order cancellations due to courier delays.
            Please be patient and cooperate.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-semibold">SIZE REPLACEMENT CONDITIONS</h3>
        <p className="mt-2">
          If you wish to replace the delivered product with the same shoes in a
          different size, it will be processed based on stock availability.
        </p>
        <p className="mt-2">
          However, if you ordered size 10 and received the correct size as per
          your order but later wish to exchange for a larger size, this is not
          possible, as we clearly specify the maximum available size (size 10)
          before purchase. Similarly, if you order size 6 and wish to replace it
          with size 5 (which is smaller), this is also not possible. Please keep
          this in mind while placing your order.
        </p>
      </section>

      <p className="mt-4 text-center font-bold">
        Note: Read carefully; do not scroll without understanding. Later, do not
        blame us. For more terms and conditions, check our website. If you have
        any doubts, clarify them with us before placing an order.
      </p>

      <p className="mt-4 text-center font-semibold">
        BEST REGARDS, {process.env.NEXT_PUBLIC_APP_NAME} TEAM
      </p>
    </div>
  );
};

export default TermsAndConditions;
