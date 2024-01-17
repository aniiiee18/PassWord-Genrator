const inputslider = document.querySelector("[data-lengthSlider]");
const lengthdisplay = document.querySelector("[data-lengthnumber]");
const passworddisplay = document.querySelector("[data-PasswordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copypassword = document.querySelector("[data-copypassword]");
const uppercasecheck = document.querySelector("#Uppercase");
const lowercasecheck = document.querySelector("#Lowercase");
const numbercheck = document.querySelector("#Numbers");
const symbolscheck = document.querySelector("#Symbols");
const indecator = document.querySelector("[data-indecator]");
const genratebtn = document.querySelector(".Genratebutton");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+=-{[}]|:;"<>,.?/';

let password = "";
let passwordlength = 10;
let checkcount = 0;
setindecator("#ccc");

sliderhandler();

// controls the slider values;
function sliderhandler()
{
    inputslider.value = passwordlength;
    lengthdisplay.innerText = passwordlength;
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ( (passwordlength - min)*100/(max - min)) + "% 100%";
}

function setindecator(color)
{
    indecator.style.backgroundColor = color;
    //shadaow
    indecator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function randint(min, max)
{
    return Math.floor(Math.random()*(max-min)) + min;
}

function genraterandomnum()
{
    return randint(0,9);
}

function genratelowercase()
{
    return String.fromCharCode(randint(97,123));
}

function genrateuppercase()
{
    return String.fromCharCode(randint(65,91));
}

function genratesymbols()
{
    let randomint = randint(0, symbols.length);
    return symbols.charAt(randomint);
}

function calcstrength(){
    let hasupper = false;
    let haslower = false;
    let hasnumber = false;
    let hassymbols = false;

    if(uppercasecheck.checked) hasupper = true; 
    if(lowercasecheck.checked) haslower = true;
    if(numbercheck.checked) hasnumber = true;
    if(symbolscheck.checked) hassymbols = true;

    if(hasupper && haslower && (hassymbols || hasnumber) && passwordlength>=8)
    {
        setindecator("#0f0");
    }
    else if ((haslower || hasupper) && (hassymbols || hasnumber) && passwordlength>=6)
    {
        setindecator("#ff0");
    }
    else{
        setindecator("#ff0");
    }
}

async function copyContent(){

    try{
        
        await navigator.clipboard.writeText(passworddisplay.value);
        copypassword.innerText = "copied";
    }
    catch(e){

        copypassword.innerText = "Failed"
        
    }

    //To make copy vala span visible 
    copypassword.classList.add("active");

    setTimeout(() => {
       
        copypassword.classList.remove("active");

    }, 2000);
}

function shufflepassword(array){
    for(let i = array.length-1; i>0; i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkcount = 0; 
    allcheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            checkcount++;
    })

    //special condition 
    if(passwordlength < checkcount)
    {
        passwordlength = checkcount;
        sliderhandler();
    }
}

allcheckbox.forEach((checkbox) =>
{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputslider.addEventListener('input', (e)=>{
    passwordlength = e.target.value;
    sliderhandler();
})

copybtn.addEventListener('click', ()=>{
    if(passworddisplay.value)
    {
        copyContent();
    }
})

genratebtn.addEventListener('click', ()=>{
    //none of the checkbox is checked 
    if(checkcount == 0) 
    return;

    if(passwordlength<checkcount) 
    {
        passwordlength = checkcount;
        sliderhandler();
    }

    //lets start the journe to find a new password

    //remove old password
    password = "";

    //lets put the stuff mentioned by checkboxes
    // if(uppercasecheck.checked)
    // {
    //     password += genrateuppercase();
    // }
    // if(lowercasecheck.checked)
    // {
    //     password += genratelowercase();
    // }
    // if(numbercheck.checked)
    // {
    //     password += genraterandomnum();
    // }
    // if(symbolscheck.checked)
    // {
    //     password += genratesymbols();
    // }

    let funcArr = [];
    if(uppercasecheck.checked)
        funcArr.push(genrateuppercase);

    if(lowercasecheck.checked)
        funcArr.push(genratelowercase);

    if(numbercheck.checked)
        funcArr.push(genraterandomnum);

    if(symbolscheck.checked)
        funcArr.push(genratesymbols);

    //compalsary addtion 
    for(let i = 0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }
    console.log("complsary done");

    //remaining addtion
    for( let i = 0; i<passwordlength - funcArr.length; i++)
    {
        let randindex = randint(0 , funcArr.length);
        console.log("randomindex" + randindex);
        password += funcArr[randindex]();
    }
    console.log("remaining done");

    //shuffle the password 
    password = shufflepassword(Array.from(password));
    console.log("shuffle done");

    //show on UI
    passworddisplay.value = password;
    console.log("show on UI done");

    //calculate strength
    calcstrength();
    console.log("calculate strength done");


})


