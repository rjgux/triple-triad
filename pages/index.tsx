import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import * as React from "react";

type CardType = {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: string;
  stars: 1 | 2 | 3 | 4 | 5;
};

const Home: React.FunctionComponent<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ cards }) => {
  const [activeCard, setActiveCard] = React.useState<CardType | null>(null);
  const [starRating, setStarRating] = React.useState<number | null>(null);
  const [searchText, setSearchText] = React.useState<string>("");

  const cardList = React.useMemo(() => {
    return cards
      .filter((card) => (!starRating ? card : card.stars === starRating))
      .filter((card) =>
        !searchText
          ? card
          : card.name.toLowerCase().includes(searchText.toLowerCase())
      );
  }, [cards, starRating, searchText]);

  return (
    <>
      <div className="container mx-auto px-4 h-screen flex">
        <div className="w-[300px] flex-shrink-0 h-full">
          <h3>Filters</h3>
          <p>Filter by star rating -</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                setStarRating(star);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
            >
              {star}
            </button>
          ))}
          <p>Search by name -</p>
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            className="border-gray-200"
          />
          <button
            onClick={() => {
              setStarRating(null);
              setSearchText(``);
            }}
          >
            Reset
          </button>
        </div>
        <div className="w-[600px] flex-shrink-0 h-full overflow-y-scroll">
          <div className="grid grid-cols-4 gap-x-5 gap-y-6">
            {cardList.map((card) => {
              const { id, name, image } = card;
              return (
                <button
                  key={id}
                  className={
                    id === activeCard?.id ? "opacity-100" : "opacity-60"
                  }
                  onClick={() => setActiveCard(card)}
                >
                  <Image src={image} alt={name} width="104" height="128" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 sticky top-0">
          {activeCard && (
            <div>
              {activeCard.name}
              <p>{activeCard.description}</p>
              <pre>{JSON.stringify(activeCard, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<{ cards: CardType[] }> =
  async ({}) => {
    const res = await fetch("https://triad.raelys.com/api/cards");
    const data = await res.json();

    const { results: cards }: { results: CardType[] } = data;

    return {
      props: {
        cards,
      },
    };
  };

export default Home;
