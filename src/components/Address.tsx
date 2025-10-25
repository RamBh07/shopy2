"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ChevronDown, Edit, X } from "lucide-react";
import { Newaddress } from "@/sanity.types";
import { getAddress } from "@/sanity/queries/queriesClient";
import ConfirmDeleteDialog from "./Buttons/ConfirmDeleteButton";

interface AddressProps {
    onAddressSelect?: (addressId: string | null, addressTitle?: string | null, addressFull?: string | null) => void;
}

const Address: React.FC<AddressProps> = ({ onAddressSelect }) => {
    const { user } = useUser();
    const [addresses, setAddresses] = useState<Newaddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const [newTitle, setNewTitle] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [isDefault, setIsDefault] = useState<boolean>(false);

    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const [editDefault, setEditDefault] = useState<boolean>(false);
    const [hasSelected, setHasSelected] = useState(false);

    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    // 🧠 Fetch addresses
    const fetchAddresses = React.useCallback(async () => {
        if (!userEmail) return;
        try {
            const data = await getAddress(userEmail);
            setAddresses(data);

            // Only set default if user hasn't manually selected yet
            if (!hasSelected) {
                const defaultAddr = data.find((addr: { default: unknown; }) => addr.default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr._id);
                    onAddressSelect?.(defaultAddr._id, defaultAddr.title, defaultAddr.fulladdress);

                    setHasSelected(true); // mark that initial selection is done
                }
            }
        } catch (err) {
            console.error("Error fetching addresses:", err);
        }
    }, [userEmail, onAddressSelect, hasSelected]);


    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    // ✅ When user manually selects address (radio)
    const handleSelectAddress = (addr: Newaddress) => {
        setSelectedAddressId(addr._id);
        onAddressSelect?.(addr._id, addr.title, addr.fulladdress);
        setHasSelected(true); // user manually selected
    };

    // ✅ Handle Save
    const handleSaveAddress = async () => {
        if (!userEmail || !newAddress.trim()) return;

        const tempAddr: Newaddress = {
            _id: crypto.randomUUID(),
            title: newTitle || "Home",
            email: userEmail,
            phone: 8637336983,
            fulladdress: newAddress,
            city: "Purulia",
            state: "West Bengal",
            pin: "723128",
            default: isDefault,
            _type: "newaddress",
            _createdAt: "",
            _updatedAt: "",
            _rev: "",
        };

        setAddresses((prev) => [...prev, tempAddr]);
        setNewTitle("");
        setNewAddress("");
        setOpenAccordion(null);

        try {
            const res = await fetch("/api/add-address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tempAddr),
            });

            const result = await res.json();
            if (result.success && result.data) {
                setAddresses((prev) =>
                    prev.map((a) => (a._id === tempAddr._id ? result.data : a))
                );

                if (result.data.default) {
                    setAddresses((prev) =>
                        prev.map((addr) =>
                            addr._id === result.data._id
                                ? { ...addr, default: true }
                                : { ...addr, default: false }
                        )
                    );
                    setSelectedAddressId(result.data._id);

                    onAddressSelect?.(result.data._id, result.data.title, result.data.fulladdress); // ✅ notify parent
                }
            }
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    // ✅ Handle Edit
    const handleEditAddress = async (id: string) => {
        setAddresses((prev) =>
            prev.map((addr) =>
                addr._id === id
                    ? { ...addr, title: editTitle, fulladdress: editAddress, default: editDefault }
                    : addr
            )
        );

        setEditId(null);

        try {
            const res = await fetch("/api/edit-address", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: id,
                    title: editTitle,
                    fulladdress: editAddress,
                    default: editDefault,
                }),
            });

            const result = await res.json();

            if (result.success && result.data) {
                setAddresses((prev) =>
                    prev.map((addr) => (addr._id === id ? result.data : addr))
                );

                if (result.data.default) {
                    setAddresses((prev) =>
                        prev.map((addr) =>
                            addr._id === result.data._id
                                ? { ...addr, default: true }
                                : { ...addr, default: false }
                        )
                    );
                    setSelectedAddressId(result.data._id);
                    onAddressSelect?.(result.data._id, result.data.title, result.data.fulladdress); // ✅ notify parent
                }
            } else {
                setTimeout(() => {
                    fetchAddresses();
                }, 800);
            }
        } catch (err) {
            console.error("Error editing address:", err);
            setTimeout(() => {
                fetchAddresses();
            }, 800);
        }
    };

    // ✅ Handle Delete
    const handleDeleteAddress = async (id: string) => {
        try {
            const res = await fetch("/api/delete-address", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: id }),
            });

            const result = await res.json();
            if (result.success) {
                setAddresses((prev) => prev.filter((a) => a._id !== id));
                if (selectedAddressId === id) {
                    setSelectedAddressId(null);
                    onAddressSelect?.(null, null, null); // ✅ notify parent cleared
                }
            }
        } catch (err) {
            console.error("Error deleting address:", err);
        }
    };

    // ✅ UI
    return (
        <div className="border p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">2️⃣ Delivery Addresses</h2>

            <Accordion
                type="single"
                collapsible
                value={openAccordion ?? undefined}
                onValueChange={(val) => setOpenAccordion(val)}
                className="w-full space-y-3"
            >
                {addresses.map((addr) => (
                    <AccordionItem key={addr._id} value={addr._id} className="border rounded-lg">
                        <AccordionTrigger className="flex justify-between p-3 w-full">
                            <div className="w-full flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={selectedAddressId === addr._id}
                                        onChange={() => handleSelectAddress(addr)} // ✅ call handler
                                        className="h-4 w-4"
                                    />
                                    <span className="font-semibold">{addr.title}</span>
                                    {addr.default && (
                                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <ChevronDown opacity={0.5} />
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="p-3 text-gray-700 bg-gray-50 rounded-b-lg space-y-3">
                            {editId === addr._id ? (
                                <>
                                    <Input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Title"
                                    />
                                    <Textarea
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        placeholder="Full address"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={editDefault}
                                            onCheckedChange={(checked) => setEditDefault(!!checked)}
                                        />
                                        <span>Set as default</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleEditAddress(addr._id)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditId(null)}
                                        >
                                            <X className="w-4 h-4 mr-1" /> Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{addr.fulladdress}</p>
                                    <div className="flex gap-3 mt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditId(addr._id);
                                                setEditTitle(addr.title!);
                                                setEditAddress(addr.fulladdress!);
                                                setEditDefault(addr.default || false);
                                            }}
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                        <ConfirmDeleteDialog onConfirm={() => handleDeleteAddress(addr._id)} />
                                    </div>
                                </>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}

                {/* Add New Address */}
                <AccordionItem value="new-address" className="border rounded-lg">
                    <AccordionTrigger className="flex justify-between p-3 w-full">
                        <span className="font-semibold">➕ Add New Address</span>
                        <ChevronDown opacity={0.5} />
                    </AccordionTrigger>

                    <AccordionContent className="p-3 bg-gray-50 space-y-3 rounded-b-lg">
                        <Input
                            placeholder="Address title (e.g. Home, Office)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <Textarea
                            placeholder="Enter full address..."
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={isDefault}
                                onCheckedChange={(checked) => setIsDefault(!!checked)}
                            />
                            <span>Set as default</span>
                        </div>
                        <Button onClick={handleSaveAddress} className="mt-2">
                            Save Address
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {selectedAddressId && (
                <div className="mt-3 text-sm text-gray-700 p-3">
                    ✅ Selected:{" "}
                    <span className="font-medium">
                        {addresses.find((a) => a._id === selectedAddressId)?.title}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Address;
