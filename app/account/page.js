import authenticate from '../../authenticate';
import Account from './account'
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers'

class Chart {
    render() {
        return chart = new PieChart({
            "labels": {
              "enabled": false
            },
            "pie": {
              "innerRadius": 0
            },
            "legend": {
              "enabled": true
            },
            "container": "demo",
            "data": [{
              "url": "https:\/\/zoomcharts.com\/data\/browsers-extended.json"
            }],
            "toolbar": {
              "fullscreen": true,
              "enabled": true
            },
            "interaction": {
              "resizing": {
                "enabled": false
              }
            }
          })
    }
}

export default async function Page() {

    const cookieStore = cookies();
    console.log(cookieStore);
    const userId = cookieStore.get('user')?.value;
    const session = cookieStore.get('session')?.value;

    const user = await authenticate.login(userId, session);

   

    console.log(user);

    
    return(
        <main className = "text-center py-4">
            
            <p> {<Account user={user}/>}</p>
            <script src="https://cdn.zoomcharts-cloud.com/1/latest/zoomcharts.js"></script>
            <p>
                <new Chart/>
            </p>
        </main>
    );


}