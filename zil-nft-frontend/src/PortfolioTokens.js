import './App.css';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPortfolioNfts } from './api'
import NFTDisplay from './NFTDisplay';
import AddressHeader from './AddressHeader';

function AddressTokens() {
  const [nfts, setNfts] = useState()
  const { id } = useParams();
  useEffect(() => {
    const fn = async () => {
      const result = await getPortfolioNfts(id)
      setNfts(result)
    }

    fn()
  }, [ id ])

  return (
    <>
      <AddressHeader address={id} />
      <NFTDisplay nfts={nfts} />
    </>
  );
}

export default AddressTokens;
