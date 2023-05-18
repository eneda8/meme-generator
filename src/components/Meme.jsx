import React, { useCallback, useRef } from "react"
import { toPng } from 'html-to-image';
import heart from "/images/heart.svg";

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    })
    const [allMemes, setAllMemes] = React.useState([])
    

    React.useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])
        
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
        
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    const ref = useRef(null)

    const onButtonClick = useCallback(() => {
      if (ref.current === null) {
        return
      }
  
      toPng(ref.current, { cacheBust: true, })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = 'meme.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err)
        })
    }, [ref])

    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button className="form--button" onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme" ref={ref}>
                <img src={meme.randomImage} className="meme--image"/>
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
            <div className="download">
                <button className="download--button" onClick={onButtonClick}>Download Meme</button>
                <p className="portfolio">made with <img className="heart" src={heart}></img> by 
                    <a className="portfolio-link" href="https://eneda.dev">eneda</a>
                </p>
            </div>
        </main>
    )
}