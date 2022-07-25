package com.smart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smart.entities.MyOrder;

public interface MyOrderRepository extends JpaRepository<MyOrder,Long > 
{
//STEP : 57 
	
	public MyOrder findByOrderId(String orderId);

	 //THe field name should follow Camel case  eg private orderId  , then can use method as findByOrderId(String orderId); 
	//Springboot will internally resolve this method and give the required results.
	

	
	
}
