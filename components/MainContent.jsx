import { MainContentClient } from "./MainContentClient";

const MainContent = ({ initialLang = "en" }) => {

  
  return <MainContentClient initialLang={initialLang} />;
};

export default MainContent;