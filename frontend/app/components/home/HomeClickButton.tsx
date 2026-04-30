

function HomeClickMeHandler(){
  console.log("Hello world");
}

export default function HomeClickButton(){
    return(
       <button 
          onClick={HomeClickMeHandler}
          className="border-2">
            Click me
        </button>
    )
}