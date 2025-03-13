'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import clsx from 'clsx';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {};

function Home({}: Props) {
  const [inputString, setInputString] = useState('');
  const [selectedOption, setSelectedOption] = useState('Encryption');
  const [output, setOutput] = useState('');
  const [loading, setIsLoading] = useState(false);

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: any) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('inputString', inputString);
    formData.append('type', selectedOption);
    formData.append('firstName', 'Sai Avinash');
    axios
      .post('/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setOutput(response.data.result);
        toast.success(selectedOption + ' processed!');
      })
      .catch(() => toast.error(selectedOption + ' processing failed!'))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <Navbar />
      <div className="max-w-[940px] w-[600px] min-w-[200px]">
        {/* Input String */}
        <div>
          <label
            htmlFor={'inputString'}
            className="block text-sm font-medium leading-6"
          >
            {`Input String`}
          </label>
          <div className="mt-2">
            <input
              id={'inputString'}
              onChange={(e) => {
                setInputString(e.currentTarget.value);
              }}
              placeholder={'Enter a String...'}
              className={clsx(
                `p-2
                  form-input
                  block
                  w-full
                  caret-black
                  rounded
                  outline-none
                  border-0
                  ring-1
                  ring-[#2a2a2c]
                  focus:ring-inset
                  focus:ring-[#4b4b4d]
                  placeholder:text-[#5c5c5e]
                  sm:leading-6`
              )}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <label
            htmlFor={'inputString'}
            className="block text-sm font-medium leading-6"
          >
            {`Operation Type`}
          </label>
          <select
            className="border-[1px] p-2 rounded"
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="Encryption">Encryption</option>
            <option value="Decryption">Decryption</option>
          </select>
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="mt-4 border-2 pt-2 pb-2 pr-4 pl-4 rounded-3xl caption-bottom hover:text-red-600 transition cursor-pointer"
          >
            Process
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <label
            htmlFor={'inputString'}
            className="block text-sm font-medium leading-6"
          >
            {`Output`}
          </label>
          <code className="flex bg-gray-200 rounded h-10 px-2 items-center">
            {output}
          </code>
        </div>
      </div>
    </div>
  );
}

export default Home;
