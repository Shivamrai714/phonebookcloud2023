package com.smart.controller;

import java.util.Random;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.smart.dao.UserRepository;
import com.smart.entities.User;
import com.smart.service.EmailService;

@Controller
public class ForgotController {

	@Autowired
	EmailService emailService;                 //step : 45 sending the mail 
	
	@Autowired                               //need to verify the user , upon validation of otp
	UserRepository userRepository;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;        //to encode new password
	
	//STEP 44:
	@RequestMapping("/forgot")
	public String openEmailForm()
	{

	  return "forgot_email_form";
		
	}
	
	//STEP : 45
	//handle reset password form submission 
	
	@PostMapping("/send-otp")
	public String sendOtp(@RequestParam("email") String email, HttpSession session )
	{
		System.out.println("Email is : "+email);
		
		//Generating the random no and send its as otp , also store that random at otp at session, to validate it with the user send otp:
		
		Random random= new Random();
		int otp = random.nextInt(999, 999999);
		
		System.out.println(otp);
		
		
		// STEP 46 : OTP SEND CODE USING EMAIL SERVICE
		
		//Done with includeing the email service class, and importing the dependency
		
	String subject=" Reset Password-OTP from PhoneBook Cloud"; 
	String to=email;
	   
	//to enable html here change in Emailserive , s.sentContext(message,"text/html");
	
	
	String message="" 
	            +  "<div style='border:1px solid #e2e2e2; padding:20px'>"
	             +"<h1>"
	             +"OTP is "
	             +"<b>"
	             + otp 
	             + "</b>"
	             +"</h1>"
		         +"</div>";
		
		boolean flag = this.emailService.sendEmail(subject, message, email);
		
		if(flag)       //means no errors OTP Send successfully so 
		{                                               //Can also store this in database
			session.setAttribute("dotp",otp);            //STORING it in session , to verify it when user submit its otp
		     session.setAttribute("email", email);
			
			return "verify_otp"; 					
		
		}
		else {
                         //when email not sent , then error displayed on the forgot email page.
			
			session.setAttribute("message","Check your email id ");
           return "forgot_email_form";
		
		}
		
		
		          // page to allow user to put the send otp to the mail
	}
	
	
	//___________________________________________________________________
	
	//STEP : 46 : VERFIy the OTP submitted by user
	
	@PostMapping("/verify-otp")
	public String verifyOtp(@RequestParam("otp") int otp , HttpSession session)
	{
		
        //getting the original random generated otp using the session : and veriy it with the OTP SEND by user , ie recieved in the @requestParam otp	
		
	    int dotp=(int)session.getAttribute("dotp");
		
	    String email=(String)session.getAttribute("email");
	   
	  System.out.println("DATAbase otp " + dotp);
		System.out.println("USer otp  "+ otp);
		System.out.println("USer email  "+ email);
		
		if(dotp==otp)
		{
			User user = this.userRepository.getUserByUserName(email);
			System.out.println(" CUrrent user "+ user);
			if(user==null)   //user does not exists
			{
				//TIME 16:05
				
				session.setAttribute("message","User does not exists :");
	           return "forgot_email_form";
			}
			else {
				//valid person , allow to set new password.
				return "change_password";			
			}
			
		}
		else {
			
			session.setAttribute("message", "You have entered Wrong Otp ");
			return "verify_otp";
		}
	
	}
	
	
	//--------------------------------------------------------
	 // STEP :  47 
	
	//Handler for change password :
	@PostMapping("/change-password")
	public String changPassword(@RequestParam("new_password") String newpassword ,HttpSession session)
	{
		
		//fetch the email id from sessopm and set this new user password;
		
		String email = (String) session.getAttribute("email");
		User user = this.userRepository.getUserByUserName(email);
		
		user.setPassword(bCryptPasswordEncoder.encode(newpassword));
		this.userRepository.save(user);
		
		System.out.println("Final stage : password Changed");
		
//		session.setAttribute("message", " Password Changed SuccessFully ");
//		return "verify_otp";
		
		return  "redirect:/signin?change=password changed successfully"; //apply if cond to show this on login page
	}
	
	
	
}
