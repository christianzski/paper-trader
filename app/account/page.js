import authenticate from '../../authenticate';
import Account from './account'
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers'
export default async function Page() {

    const cookieStore = cookies();
    console.log(cookieStore);
    const userId = cookieStore.get('user')?.value;
    const session = cookieStore.get('session')?.value;

    const user = await authenticate.login(userId, session);

   

    console.log(user);

    

    return(
        <main className = "text-center py-4">
            <p className = "interBold">Account</p>
            <p> {<Account user={user}/>}</p>
        </main>
    );


}