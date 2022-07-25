//console.log("this is script file and i had attached it here");
// write hiding configureation for side bar
const toggleSidebar=() => {

if($('.sidebar').is(":visible"))
{
    $(".sidebar").css("display","none");
    $(".content").css("margin-left","0%");
}
else
{
$(".sidebar").css("display","block");
$(".content").css("margin-left","20%");

}

};

//STEP : 35
//writint the configuration for search Controller

const search=() =>{

    //console.log("searching...");

    let query=$("#search-input").val();         //attach the jquery if, not presnt
    console.log(query);

    if(query==''){
        $(".search-result").hide();
    }
   else{
    console.log(query);

    //sending request to server

    let url=`http://localhost:8282/search/${query}`;

    fetch(url)
      .then((response) => {
        return response.json();
    })
    .then((data) => {
   
     //   console.log(data);

let text=`<div class='list-group'>`;

     data.forEach((contact) => {
     text+=`<a href="/user/${contact.cid}/contact"  class="list-group-item list-group-action">${contact.name}</a>`
     });
        
text += `</div>`;

       $(".search-result").html(text);
       $(".search-result").show();
       

    });


    $(".search-result").show();
   }

};



// CODING FOR HANDLEING THE PAYMENT INTEGRATION SUPPORT

//STEP : 50 first request to create the order.
     
const paymentstart = ()=> { 

      console.log("Payment method is working on clicking button");
     
      //using jquery to fetch the amount sent

      let amount=$("#payment_field").val();
      console.log(amount);

      if(amount=='' || amount == null)
      {
	  // alert("amount cis required !! ");
    swal("Failed !", "amount is required", "error");

    return;
      }
      
      
      //code..
      // we will  use the ajax to send the request to server to create the order.
      //attach the new cdn of jquery   
     
 //STEP 52 :     

 $.ajax(
{
  url : '/user/create_order',
  data:JSON.stringify({amount:amount , info:'order_request'}),
  contentType: 'application/json',
  type:'POST',
  dataType:'json',
  success:function(response){
    //invoked when success.
    console.log(response);
  //STEP  53 after receiving the order id from the server open the paymnent form.

  if(response.status=='created')
  {
    //open payment form using the Razor Pay web interation code.
   //(step 53) Need to attach the razor pay script tag in base.html before the actual js of script tag

let options={
      key:'rzp_test_8TFsUYjZM9VXJ5',
      amount:response.amount,
      currency:'INR',
      name:'PhoneBook Cloud ',
      description:'Donation',
      image:'https://media-exp2.licdn.com/dms/image/C4E03AQF5z_HzMNfnfw/profile-displayphoto-shrink_100_100/0/1632166608135?e=1663804800&v=beta&t=KrWb83xpwSjkjIJztd79yuxnQM2Nja6Vfdbnp5xIXxQ',
      order_id:response.id,

      handler:function(response)
      {
        console.log(response.razorpay_payment_id);
        console.log(response.razorpay_order_id);
        console.log(response.razorpay_signature);

        console.log('payment successfull');
        //alert("congrats !! PAYMENT DONE ");


       //STEP 56 : update the details of payment done in our database.
                   //defined at last of this file
       updatePaymentOnServer(response.razorpay_payment_id,
        response.razorpay_order_id,
        "paid" 
        );
      //This success messge is transferred to execute after saving the data in the database
       // swal("Good job!", "congrats !! PAYMENT DONE", "success");

      },
      prefill: {
      name: "",
        email: "",
        contact: ""
    },

    notes: {
        address: "Shivam Java Programmar",
    },

    theme: {
        color: "#3399cc"
    },

 };


 // After the Showing from , Initiate the Payment.
//STEP 54 

let rzp = new Razorpay(options);


//copid the code form web integration . for payment field.
//

rzp.on('payment.failed', function (response){
  console.log(response.error.code);
  console.log(response.error.description);
  console.log(response.error.source);
  console.log(response.error.step);
  console.log(response.error.reason);
  console.log(response.error.metadata.order_id);
  console.log(response.error.metadata.payment_id);

//alert("Opps !! payment failed");
swal("Failed !", "Opps !! payment failed", "error");


});


//no error then success 

rzp.open();

  }






  },
  error:function(error){
     //invoked when error.
     console.log(error);
 //   alert("something is alot wrong !! ");
 swal("Failed !", "something is alot wrong !!", "error");

  },


});

};



//Function to save the status on database.

function updatePaymentOnServer(payment_id,order_id,status)
{
  $.ajax({
    url : "/user/update_order",       //STEP 56 : make a handler in UserController
    data:JSON.stringify({
    payment_id:payment_id,
    order_id:order_id,
    status:status,
    }),
    contentType: "application/json",
    type:"POST",
    dataType:"json",
   
    success:function(response){
      //take the success fun from above and put it here , after saving in the database.
      swal("Good job!", "congrats !! PAYMENT DONE", "success");


    },
    error:function(error){
      swal("Failed !", "Payment SuccessFull but not reflected in our database , Our  team will contact u soon", "error");
    },


    });

}