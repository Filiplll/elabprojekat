import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { useState } from "react";

export default function SearchSection({ sportsOptions = [] }) {
  const navigate = useNavigate();
  const [searchParamsFromUrl] = useSearchParams();

  const getUrlParams = () => ({
    sport_id: searchParamsFromUrl.get("sport_id") || "",
    grad: searchParamsFromUrl.get("grad") || "",
    natkriven: searchParamsFromUrl.get("natkriven") || "",
  });

  const [searchParams, setSearchParams] = useState(getUrlParams);
  const [prevUrlString, setPrevUrlString] = useState(
    searchParamsFromUrl.toString(),
  );

  const currentUrlString = searchParamsFromUrl.toString();
  if (currentUrlString !== prevUrlString) {
    setPrevUrlString(currentUrlString);
    setSearchParams(getUrlParams());
  }

  const coveredOptions = [
    { value: "1", label: "Natkriven" },
    { value: "0", label: "Otkriven (na otvorenom)" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const newParams = new URLSearchParams(searchParamsFromUrl);

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    newParams.delete("page");

    const queryString = newParams.toString();
    navigate(`/tereni${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <Select
          label="Sport"
          value={searchParams.sport_id}
          onChange={(e) =>
            setSearchParams({ ...searchParams, sport_id: e.target.value })
          }
          options={sportsOptions}
          placeholder="Svi sportovi"
        />

        <Input
          label="Grad"
          placeholder="Npr. Beograd"
          value={searchParams.grad}
          onChange={(e) =>
            setSearchParams({ ...searchParams, grad: e.target.value })
          }
        />

        <Select
          label="Tip terena"
          value={searchParams.natkriven}
          onChange={(e) =>
            setSearchParams({ ...searchParams, natkriven: e.target.value })
          }
          options={coveredOptions}
          placeholder="Svi tipovi"
        />

        <Button
          type="submit"
          variant="primary"
          icon={Search}
          className="w-full py-2.5"
        >
          Pretraži
        </Button>
      </form>
    </section>
  );
}
