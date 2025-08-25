
import {  clerkClient } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { db } from "@/lib/db";
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'



export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

     console.log("EventType", eventType);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      // Parse the incoming event data
      
     // const  data = JSON.parse(JSON.stringify(evt.data));
      // Create a user object with relevant properties
      const user: Partial<User> = {
        id: evt.data.id,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        email: evt.data.email_addresses[0].email_address,
        picture: evt.data.image_url,
        
      };
      // If user data is invalid, exit the function
      if (!user) return;
  
      // Upsert user in the database (update if exists, create if not)
      const dbUser = await db.user.upsert({
        where: {
          email: user.email,
        },
        update: user ,
        create: {
          id: user.id!,
          name: user.name!,
          email: user.email!,
          picture: user.picture!,
          role: user.role || 'USER', // Default role to "USER" if not provided
        },
      });

    
  
      // Update user's metadata in Clerk with the role information
      const client = await clerkClient();
      
      
     /* await client.users.updateUser(evt.data.id,{
        privateMetadata:{
          role:dbUser.role || "USER"
        }
      })*/
     
     
      
     await client.users.updateUser(evt.data.id, {
        privateMetadata: {
          role: dbUser.role || 'USER' , // Default role to "USER" if not present in dbUser
        },
      });
    }
  
    // When user is deleted
   if (evt.type === "user.deleted") {
      // Parse the incoming event data to get the user ID
      const userId = JSON.parse(JSON.stringify(evt.data)).id;
  
      // Delete the user from the database based on the user ID
      await db.user.delete({
        where: {
          id: userId,
        },
      });
    } 

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  } 
}
 