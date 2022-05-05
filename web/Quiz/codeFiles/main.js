import { question } from "./js/questionsBank.js"

const $ = e => document.querySelector(e)
const $$ = e => document.querySelectorAll(e)
const _ = e => document.createElement(e)
const _t = e => document.createTextNode(e)
const click = ( e , f ) => {
  $( e ).addEventListener('click' , f )
} 

// __________________________ 

// main variables 

let mainTimesVal = 30 ;
let time = mainTimesVal ; 

let mainValOfQn = 5 ;
let qnThisLvl = mainValOfQn ; 

let lvl = 1 

let [ trueAnswer , falseAnswer ] = [ 0 , 0 ] 

let changeChance = 3 ; 

let liveNum = 3 ; 

let hueR = 0 ; 

let listOfQ = [] 

// __________________________ 

$('.changeNumBox').innerHTML = changeChance ; 

let changeChancePoints = $$('.addChangeChanceProgress div') ;
let pointCirNum = 0 

// __________________________ 

let timming ;
const timer = {
  start : () => {
    timming = setInterval(() => {
     if( time != 0 ) {
        time--;
        $('.timer').innerHTML = time
      } else {
        // if time is 0
        runOutTime()
      }

    }, 1000 ) 
  } ,
  stop : () => {
    clearInterval( timming )
    time = mainTimesVal
  }
} 

// __________________________
let allowClick = true
let btns = $$('.btn')
btns.forEach( ( e , i ) => {
   e.addEventListener('click', function() {
     if( allowClick ) {
       if( i + 1 == question[ randomQ ].trueAnswer ) {
       // player answer is true
          check3Answer()
          timer.stop()
          trueAnswer++
          this.style.background = 'lightgreen'
       }
       else {
       //player answer is false
       
         // clear the points of adding change chanse
         pointCirNum = 0 ;
         for( let i = 0 ; i <= 2 ; i++ ) {
           changeChancePoints[ i ].style.background = '#fff' ;
         }
         
         // remove 1 live if the answer was false 
         if( liveNum != 0 ) {
           liveNum--
           setLives()
         }
         else {
           // if lives = 0 ; player is loset
           result()
           resultMenu.innerHTML = 'خسرت'
           again()
         }
         this.style.background = 'rgba( 255 , 0 , 0 , .5 )'
         btns[ question[ randomQ ].trueAnswer - 1 ].style.background = 'yellow'
         falseAnswer++ ;
       }
       
     }
     // some things to do on answer
     randomQ++ 
     timer.stop()
     allowClick = false
     qnThisLvl-- ;
     checkFinsh()
     next()
     msg()
     
   })
   
})



// __________________________ 

// set a random index for question 

let randomQ = Math.floor( Math.random() * question.length ) ; 

// __________________________ 

const winTxt = _t('فائز')
const loseTxt = _t('خسرت') 

// change the Question 

$('.change').addEventListener('click', () => {
if( changeChance != 0 ) {
  if (randomQ != question.length - 1) { randomQ++ }
  else { randomQ = 0 }
  
  time = mainTimesVal ;
  
  changeChance--
  newQ()
}
}); 

// __________________________ 

// some functions 

function ask() {
  if (randomQ == question.length) { randomQ = 0 }
  timer.start()
  $('.qn').innerHTML = qnThisLvl
  $('.subBox').innerHTML = question[randomQ].sub
  $('.questionContentBox').innerHTML = question[randomQ].q 

  btns.forEach(( e , i ) => {
    e.innerHTML = question[ randomQ ].a[ i ]
  });
  
  // add the question API to the array ( listOfQ )
  listOfQ.push({
    sub : question[randomQ].sub ,
    q : question[randomQ].q ,
    a :[ question[ randomQ ].a[ 0 ] ,
         question[ randomQ ].a[ 1 ] ,
         question[ randomQ ].a[ 2 ] ,
         question[ randomQ ].a[ 3 ] 
       ] ,
    trueAnswer : question[ randomQ ].trueAnswer ,
    msg : question[randomQ].msg
  });
}
ask(); 

function next() {
  let nextBtn = _('button')
      nextBtn.classList = 'nextBtn'
      nextBtn.innerHTML = 'التالي'
      
      nextBtn.addEventListener('click' , () => {
        allowClick = true
        ask()
        btns.forEach((e) => { e.style.background = '#fff'})
        nextBtn.remove()
        msgBox.remove()
      });
      
  $('main').appendChild( nextBtn )
} 

let msgBox ;
function msg() {
    msgBox = _('div')
    msgBox.classList = 'msg'
    msgBox.innerHTML = question[ randomQ - 1 ].msg // <======
      
    msgBox.addEventListener('click' , function() {
      msgBox.style.opacity = '.2'
    });
    
  $('main').appendChild( msgBox )
} 

function checkFinsh() {
  if( qnThisLvl == 0 ) {
    qnThisLvl = mainValOfQn
    result()
  }
} 

let resultMenu , myQBtn , myQList ,
    QListIsOpened = false ; 

function result() {
  // the layout of result page
  resultMenu = _('div')
  resultMenu.classList = 'overlay'
  $('main').appendChild( resultMenu )
  setTimeout(() => {
    resultMenu.style.height = '100vh' 
    resultMenu.style.transition = '0.5s'
  }, 10 )
  
  // button for show the last questions 
  myQBtn = _('div')
  myQBtn.classList = 'myQBtn'
  myQBtn.innerHTML = '?'
  $('.overlay').appendChild( myQBtn )
  // when clicking on (?) button for see the last questions 
  myQBtn.addEventListener('click' , function() {
    if( !QListIsOpened ) {
      this.innerHTML = '×'
          myQList = _('div')
          myQList.classList = 'myQList'
      $('.overlay').appendChild(myQList)
      QListIsOpened = true
 
      for( let o = 0 ; o < listOfQ.length ; o++ ) {
        
      myQList.innerHTML += `
      <div> ( ${ o + 1 } ) ${ listOfQ[ o ].sub } </div>
      <div> ${ listOfQ[ o ].q } </div>
      <div class='aInQList Q${ o }'> 
        <span class='btn'> ${ listOfQ[ o ].a[0] } </span>
        <span class='btn'> ${ listOfQ[ o ].a[1] } </span>
        <br>
        <span class='btn'> ${ listOfQ[ o ].a[2] } </span>
        <span class='btn'> ${ listOfQ[ o ].a[3] } </span>
      </div>
      <div class='info'> ${ listOfQ[ o ].msg } </div>
      <hr>
      `
      let btnsInQList = $$(`.Q${ o } .btn`) ;
      
      btnsInQList[ listOfQ[ o ].trueAnswer - 1 ].style.background = 'lightgreen'
      }
    }
    else {
      this.innerHTML = '?'
      QListIsOpened = false
      myQList.remove()
    }
  })
  
  if( trueAnswer >= falseAnswer ) {
    addSomeDetails( winTxt )
    mainValOfQn += 3 ;
    
    // To next level
    let nextLvlBtn = _('button')
      nextLvlBtn.classList = 'nextLvlBtn'
      nextLvlBtn.innerHTML = 'next'
      // when clicking on next level button
      $('.overlay').appendChild( nextLvlBtn )
      nextLvlBtn.addEventListener('click' , () => {
        resultMenu.remove()
        liveNum++ 
        setLives()
        qnThisLvl += 3 ;
        lvl += 1
        $('.lvl').innerHTML = lvl
        trueAnswer = 0
        falseAnswer = 0
        listOfQ = []
        hueR += 30
        $('.overCir').style.filter = `hue-rotate(${ hueR })`
      });
      
  } else {
    addSomeDetails( loseTxt )
    again()
  }
  
} 

function check3Answer() {
  if (pointCirNum == changeChancePoints.length - 1 ) {
    changeChance++
    $('.changeNumBox').innerHTML = changeChance;
    pointCirNum = 0;
    for (let i = 0; i <= 2; i++) {
      changeChancePoints[i].style.background = '#fff';
    }
  }
  else {
    changeChancePoints[pointCirNum].style.background = 'gold';
    pointCirNum++
  }
} 

function again() {
  let againBtn = _('button')
      againBtn.classList = 'again'
      againBtn.innerHTML = 'again'
  $('.overlay').appendChild( againBtn )
  // when clicking on "again" button
  againBtn.addEventListener('click' , () => {
    resultMenu.remove()
    qnThisLvl = mainValOfQn ;
    trueAnswer = 0 
    falseAnswer = 0
    liveNum = 3
    setLives()
  });
} 

function setLives() {
  $('.lives').innerHTML = `${ liveNum } × &#9825;`
}
setLives() 

function addSomeDetails( state ) {
  // container for showing win or lose
  let WorL = _('div')
      WorL.classList = 'WorL'
  $('.overlay').appendChild( WorL )
  WorL.appendChild( state )
  
  // container for showing the %
  let p = _('div')
      p.classList = 'percent'
  let pNum = 
  $('.overlay').appendChild(p)
  p.appendChild( _t( Math.floor( ( trueAnswer / qnThisLvl ) * 100 )+ '%') )
} 

// if time is 0
function runOutTime() {
  if (liveNum != 0) {
    liveNum--
    setLives()
    randomQ++
    newQ()
    time = mainTimesVal;
  } else {
    result()
    resultMenu.innerHTML = 'خسرت'
    again()
    timer.stop()
  }
} 

function newQ() {
  $('.changeNumBox').innerHTML = changeChance;
  
  $('.subBox').innerHTML = question[randomQ].sub
  $('.questionContentBox').innerHTML = question[randomQ].q
  
  btns.forEach((e, i) => {
    e.innerHTML = question[randomQ].a[i]
  });
}


/*******************/

var aud = new Audio('salam.mp3') ;
    aud.play()