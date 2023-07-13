'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useEffect} from 'react';

export default function Redirect({authenticated}) {
    const router = useRouter();
    const path = usePathname();

    if(!authenticated && !(path == "/landing" || path == '/login' || path == '/register')) {
       useEffect(() => {
            router.push("/landing");
        }, []);
    }

    return (<></>);
}