// This function produces a json object of binary values from 1-255

function binaryUpTo(upTo)
{
    var binary;
    var maxI;
    var tempVar;
    var output_json = {};

    for (var i = 1; i <= upTo; i++)
    {
        //hold each i, so we can subtract from it later
        tempVar = i;

        //find the largest j s.t. 2^j<=tempVar
        for (var j = 0; Math.pow(2, j) <= tempVar; j++)
        {
            //set maxI equal to that largest j
            maxI = j;
        }

        //make an array called binnary with length of the maxI
        binary = new Array(maxI + 1);
        //set the first spot in the array to 1
        binary[binary.length - maxI - 1] = 1;
        //subtract 2^maxI from the tempvar
        tempVar -= Math.pow(2, maxI);
        //decrement maxI by one, so the index goes down and we can compare maxI^2 to tempVar
        maxI -= 1;

        while (maxI >= 0)
        {
            //is 2^maxI is <= tempVar then put a 1 in the next slot in the array
            if (Math.pow(2, maxI) <= tempVar)
            {
                binary[binary.length - maxI - 1] = 1;
                tempVar -= Math.pow(2, maxI);
            }
            else
            { //else put a 0 in the next slot in the array
                binary[binary.length - maxI - 1] = 0;
            }
            //decement maxI and repeat!
            maxI--;
        }

        var n = binary.join("");
        output_json[i] = ('00000000'+n).slice(-8);
    }
    return output_json;
}

//call function up to 255
var bytes = binaryUpTo(255);

$( document ).ready(function() {
	var random_number, sequence;
	
	if(bytes){
		console.log(bytes);
		set_values();
	}
	// set number function
	function set_values() {
		var cards = $('.card');
		// createa a random number between 1 and the length of possible numbers in the bytes array
		var size = Object.keys(bytes).length;
			random_number = Math.floor(Math.random() * (size - 1) + 1)
		
		// Get sequence from generated number
			sequence  = bytes[random_number];
		var sequenced = sequence.split("");
		
		$('.card').each(function(index){
			// assign number to card
			// Get the correct digit
			var binary_digit = sequenced[index];
			
			// Add off class to cards with a 0
			if(sequenced[index] == "0"){
				$(this).addClass('off');
			}else{
				$(this).removeClass('off');
			}
			// add binary digit to card 
			$(this).text(binary_digit);
			
		});
	}
	// Timer
	var seconds = 00; 
	var tens = 00; 
	var appendTens = document.getElementById("tens");
	var appendSeconds = document.getElementById("seconds");
	var buttonStart = document.getElementById('button-start');
	var buttonStop = document.getElementById('button-stop');
	var buttonReset = document.getElementById('button-reset');
	var Interval ;
	
	buttonStart.onclick = function() {
		clearInterval(Interval);
		Interval = setInterval(startTimer, 10);
	}
	
	buttonStop.onclick = function() {
		clearInterval(Interval);
	}

	buttonReset.onclick = function() {
		clearInterval(Interval);
		tens = "00";
		seconds = "00";
		appendTens.innerHTML = tens;
		appendSeconds.innerHTML = seconds;
	}

  function startTimer () {
	  
    tens++; 
    
    if(tens < 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
  }
  
  var correct, total_time, speed;
  var won = $('#won span');
  setInterval(function(){
	correct = parseInt(won.text());
	total_time = seconds + (tens/100);
	speed = correct/total_time; 
	if(isNaN(speed) || !isFinite(speed)) {
		speed = 0;
	}
	$('#bits_per_second').text(speed.toFixed(3) + " bits per second");
  }, 100);
	
	
	// add events for each button
	$('#new_values').on('click', function (){
		set_values();
		// Place input field into focus
		$('input[name="answer"]').focus();
	});
	
	$('#toggle_binary_values').on('click', function(){
		$('.binary_value').toggle();
	});
	
	$('#submit_answer').on('click', function(){
		var user_input = $('input').val();
		$('input').val('');
		
		// if the answer is correct
		if(user_input == random_number){
			
			// update the message
			$('#message').text("Congratulations! "+sequence+" is equal to "+user_input+"!");
			$('#message').removeClass();
			$('#message').addClass('green');
			
			// update the win count
			// get the current count
			var total = $('#won span').text();
				// convert to an integer, increment, and reassign
				total = parseInt(total);
				total++;
				$('#won span').text(total);
		}else{
			$('#message').text("Sorry... "+sequence+" is not equal to "+user_input+", please try again.");
			$('#message').removeClass();
			$('#message').addClass('red');
			
			var total = $('#lost span').text();
				// convert to an integer, increment, and reassign
				total = parseInt(total);
				total++;
				$('#lost span').text(total);
		}
		
		// provide new binary number
		set_values();
		
		// Place input field into focus
		$('input[name="answer"]').focus();
			
	});
});