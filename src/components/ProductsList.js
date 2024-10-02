import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Loader from "./Loader";
import { BASE_URL } from "@/apis/baseurl";
import { BackgroundGradientDemo } from "./BackgroundGradientDemo";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState({ pages: 0 });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [direction, setDirection] = useState(null);

  const router = useRouter();

 

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/products?page=${page}&search=${search}&sort=${sort}&direction=${direction}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
          },
        }
      );
      const data = await res.json();
      setProducts(data?.products);
      setMetadata({
        pages: Math.ceil(data?.total / 10),
      });
      setError(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/signin");
        return;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div className="container mx-auto p-4">
      {/* <div className="flex mb-4">
        <input
          type="text"
          value={search}
          onChange={onTextChange}
          onKeyDown={onEnter}
          placeholder="Filter products"
          className="p-2 border rounded w-full mr-2"
        />
        <button
          onClick={onSearch}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      <div className="flex mb-4">
        <select onChange={onSortChange} className="p-2 border rounded w-full">
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
        </select>
      </div> */}
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {products?.map((product) => (
                  //  <ProductItem product={product} key={product.id}/> 
                  <BackgroundGradientDemo product={product} key={product.id}/>

          ))}
        </motion.div>
      )}
      {/* <div className="flex justify-between mt-4">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={page === metadata.pages}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div> */}
    </div>
  );
}

export default ProductList;
