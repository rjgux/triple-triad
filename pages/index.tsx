import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  React.useEffect(() => {
    setActiveCard(null);
  }, [starRating, searchText]);

  React.useEffect(() => {
    if (cardList.length === 1) {
      setActiveCard(cardList[0]);
    }
  }, [cardList]);
  return (
    <>
      <main className="flex space-x-12 px-12">
        <aside className="w-[400px] self-start flex-shrink-0 h-auto py-12 space-y-6 sticky top-0">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold">FFXIV Triple Triad Cards</h2>
            <p className="text-sm">API provided by https://triad.raelys.com/</p>
            <p className="text-sm">Made by @rjgux</p>
          </div>

          <div>
            <p className="font-bold">Filter by ⭐ rating -</p>
            <ul className="flex items-center space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <li key={`rating_${star}`}>
                  <button
                    onClick={() => {
                      setStarRating(star);
                    }}
                    className={`${
                      star === starRating
                        ? `text-2xl font-bold text-black`
                        : `text-lg font-bold text-black`
                    }`}
                    style={{
                      textShadow:
                        "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
                    }}
                  >
                    {star}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Filter by name -</p>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="bg-transparent border-white"
            />
          </div>
          <button
            onClick={() => {
              setStarRating(null);
              setSearchText(``);
            }}
          >
            ❌ Reset Filters
          </button>
          {activeCard && (
            <div className="bg-white text-black rounded-md p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <Image
                  src={activeCard.icon}
                  alt={activeCard.name}
                  width="40"
                  height="40"
                  className="rounded-full w-10 h-10"
                />
                <h3 className="font-bold text-lg">
                  {activeCard.name} - #{activeCard.id}
                </h3>
              </div>

              <p className="text-sm">{activeCard.description}</p>
            </div>
          )}
        </aside>
        <div className="flex-1 flex-shrink-0 py-12">
          {cardList.length > 0 ? (
            <div
              className="grid grid-flow-row gap-6"
              style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(120px, 1fr))`,
              }}
            >
              <AnimatePresence initial={true}>
                {cardList.map((card) => {
                  const { id, name, image } = card;
                  return (
                    <motion.button
                      key={`cards_${id}`}
                      layout
                      className={`w-[7rem] ${
                        activeCard && activeCard.id === id
                          ? `opacity-100`
                          : `opacity-60`
                      }`}
                      onClick={() => setActiveCard(card)}
                    >
                      <Image src={image} alt={name} width="104" height="128" />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <>No cards to show!</>
          )}
        </div>
      </main>
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
