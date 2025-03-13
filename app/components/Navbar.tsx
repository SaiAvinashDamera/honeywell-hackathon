import Image from 'next/image';
import React from 'react';
import HoneywellLogo from '../../public/honeywell-logo.png';

type Props = {};

function Navbar({}: Props) {
  return (
    <div className="flex h-20 w-full items-center justify-between px-8 border-b-[1px] border-gray-200">
      <div className="w-44">
        <Image
          alt="honeywell-logo"
          width={HoneywellLogo.width}
          height={HoneywellLogo.height}
          src={HoneywellLogo}
        />
      </div>
      <div className="text-3xl font-bold text-gray-800">
        Encryption/Decryption
      </div>
      <div></div>
    </div>
  );
}

export default Navbar;
