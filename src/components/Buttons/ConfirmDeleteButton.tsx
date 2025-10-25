import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

const ConfirmDeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline">
                <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Address</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={onConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);
export default ConfirmDeleteDialog