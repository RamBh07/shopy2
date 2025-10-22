import React from "react";
import { Title } from "../ui/text";
import Link from "next/link";
import Image from "next/image";



const HomeBanner = () => {
  return (
    <div className="py-5 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex items-center justify-between mt-5 flex-col md:flex-row">
      <div className="space-y-5">
        <Title>
          Grab Upto 50% off on <br />
          Selected Groceries Product
        </Title>
        <Link
          href={"/shop"}
          className="bg-shop_dark_green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop_dark_green hoverEffect"
        >
          Buy Now
        </Link>
      </div>
      <div className="">
        <Image
          src={'/banner/banner_2-removebg-preview.png'}
          width={400}
          height={400}
          alt="banner_2"
          className="md:inline-flex"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
