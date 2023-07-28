// import React, { useState } from 'react';

// const UserProfile = () => {
//     const [showEmail, setShowEmail] = useState(false);
//     const [page, setPage] = useState('profile'); // State to handle page views

//     // Mock user data
//     const user = {
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'j***@example.com',
//         fullEmail: 'john@example.com',
//         highestPrice: '$500',
//         lowestPrice: '$50',
//         accountCreated: 'July 10, 2021'
//     }

//     // Render user profile information
//     const renderProfile = () => (
//         <div className="flex flex-col p-8">
//             <p className = "interBold">Account</p>
            
//             <p className="text-xl">First Name: {user.firstName}</p>
//             <p className="text-xl">Last Name: {user.lastName}</p>
//             <p className="text-xl">
//                 Email: 
//                 {showEmail ? user.fullEmail : user.email} 
//                 <button 
//                     className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                     onClick={() => setShowEmail(!showEmail)}
//                 >
//                     Toggle
//                 </button>
//             </p>
            
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
//                 Forgot Password
//             </button>
            
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
//                 Change Email
//             </button>
            
//             <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
//                 Delete Account
//             </button>
//         </div>
//     )

//     // Render user analytics information
//     const renderAnalytics = () => (
//         <div className="flex flex-col p-8">
//             <h1 className="text-4xl font-bold mb-4">User Analytics</h1>
            
//             <p className="text-xl">Highest Price: {user.highestPrice}</p>
//             <p className="text-xl">Lowest Price: {user.lowestPrice}</p>
//             <p className="text-xl">Account Created: {user.accountCreated}</p>
//         </div>
//     )

//     return (
//         <div>
//             <button 
//                 className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" 
//                 onClick={() => setPage(page === 'profile' ? 'analytics' : 'profile')}
//             >
//                 Switch to {page === 'profile' ? 'Analytics' : 'Profile'} View
//             </button>
            
//             {page === 'profile' ? renderProfile() : renderAnalytics()}
//         </div>
//     )
// }

// export default UserProfile;
