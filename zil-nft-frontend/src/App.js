import './App.css';
import { useEffect, useState } from 'react'
import { getRecentNfts } from './api'
import NFTDisplay from './NFTDisplay';
import MainHeader from './MainHeader';

function App() {
  const [nfts, setNfts] = useState()
  useEffect(() => {
    const fn = async () => {
      const result = await getRecentNfts()
      setNfts(result)
    }

    fn()
  }, [])

  return (
    <>
      <MainHeader />
      <NFTDisplay nfts={nfts} />
    </>
  );
}

export default App;
