"use client";

import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import { Search } from "lucide-react";

const Searchbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          search: e.target.value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="relative w-full mr-1 md:mr-4 md:ml-4 mx-auto">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <Search className="w-4 h-4 stroke-slate-500" />
      </div>
      <input
        type="search"
        className="block w-full max-w-[500px] px-3 py-2 ps-10 text-sm text-gray-900 border-gray-300 border-b bg-transparent outline-none active:outline-none"
        placeholder="Search..."
        onChange={handleChange}
      />
    </div>
  );
};

export default Searchbar;
