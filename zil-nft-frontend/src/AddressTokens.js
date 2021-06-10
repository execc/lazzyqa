import './App.css';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAddressNfts } from './api'
import NFTDisplay from './NFTDisplay';
import AddressHeader from './AddressHeader';

function AddressTokens() {
  const [nfts, setNfts] = useState()
  const { address } = useParams();
  useEffect(() => {
    const fn = async () => {
      const result = await getAddressNfts(address)
      setNfts(result)
    }

    fn()
  }, [ address ])

  return (
    <>
      <AddressHeader address={address} />
      <NFTDisplay nfts={nfts} />
    </>
  );
}

export default AddressTokens;
