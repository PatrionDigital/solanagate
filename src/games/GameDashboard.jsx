// src/games/GameDashboard.jsx
import { Card, Button } from "@windmill/react-ui";
import { Link } from "react-router-dom";

const games = [
  {
    name: "TokenPet",
    route: "/games/tokenpet",
    description: "Raise, evolve, and care for your digital TokenPet.",
    img: "https://picsum.photos/seed/tokenpet/400/200"
  },
  {
    name: "Spinner Game",
    route: "/games/spinner",
    description: "Spin the wheel for a chance to win VERMIN tokens and bonuses!",
    img: "https://picsum.photos/seed/spinner/400/200"
  }
  // Add more games here as you expand
];

const GameDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {games.map((game) => (
        <Card key={game.name} className="flex flex-col items-center justify-between p-0 overflow-hidden">
          <img src={game.img} alt={game.name} className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1 w-full">
            <h3 className="text-xl font-bold text-gold mb-2">{game.name}</h3>
            <p className="text-gray-300 mb-4 flex-1">{game.description}</p>
            <Button tag={Link} to={game.route} className="w-full mt-auto bg-gold text-black font-bold">
              Play
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GameDashboard;
