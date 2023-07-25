import { Fragment, useState, useEffect } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { useRouter } from 'next/navigation'

export default function Example() {
    const router = useRouter();

    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [items, setItems] = useState([]);

    useEffect(() => {
        if(selected != null) {
            router.push('/market/' + selected);
        }
    }, [selected]);

    useEffect(() => {
        if(query.length > 0) {
            setLoading(true);

            fetch(window.location.origin + "/search?query=" + query.toUpperCase())
            .then((result) => result.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            });
        } else setItems([]);
    }, [query]);

    return (
        <div className = "grow max-w-2xl">
        <Combobox value={selected} onChange={setSelected}>
            <div className="relative mt-1 ml-10">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                placeholder="Search companies..."
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
                </Combobox.Button>
            </div>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
            >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {((items.length === 0 && query !== '') || loading) ? (
                    <div className="relative cursor-default select-none flex items-center py-2 px-4 text-gray-700">
                        {(loading) ? (
                            <>
                            <div className="loading" role="status"></div>
                            <p className="ml-5">Loading...</p>
                            </>
                        ) :
                        (<p className="ml-5">Nothing found.</p>) }
                    </div>
                ) :
                (
                    items.map((stock) => (
                    <Combobox.Option
                        key={stock["Symbol"]}
                        className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                        }
                        value={stock["Symbol"]}
                    >
                        {({ selected, active }) => (
                        <>
                            <span
                            className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                            }`}
                            >
                            <div>
                                {stock["Symbol"]}
                            </div>
                            <div>
                                {stock["Company Name"]}
                            </div>
                            </span>
                            {selected ? (
                            <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-teal-600'
                                }`}
                            >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            ) : null}
                        </>
                        )}
                    </Combobox.Option>
                    ))
                )}
                </Combobox.Options>
            </Transition>
            </div>
        </Combobox>
        </div>
    );
}
