import { Bebas_Neue } from "next/font/google";
import Image from "next/image";

const babs = Bebas_Neue({
  weight:["400"],
  subsets:["latin"]
})
export default function Brand({ className }: any) {
  const brandName = process.env.NEXT_PUBLIC_APP_NAME || 'WATCHZ';

  return (
    <div className={`${className} `}>
      {/* Vertical accent bar */}

     <Image alt="Stride" src="/wm-3.png" height={50} width={100}/>
    </div>
  );
}