import { ToastContainer } from "react-toastify";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="bg-primary flex min-h-screen justify-center p-8">
      <Calendar />
      <ToastContainer />
    </div>
  );
}

export default App;
