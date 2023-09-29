import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Button, Flex, Td, Text, Tr, useDisclosure } from "@chakra-ui/react";
import { useSetCurrentNVMVersion } from "../../hooks/useSetCurrentNVMVersion";
import { useMemo, useRef } from "react";
import { useInstallVersion } from "../../hooks/useInstallVersion";
import { useDeleteVersion } from "../../hooks/useDeleteVersion";

export const NodeVersionRow = ({ version }: {
    version: TNodeVersion
}) => {
    const setCurrentVersion = useSetCurrentNVMVersion();
    const { mutate: install, isLoading: isInstalling } = useInstallVersion();
    const { mutate: deleteVersion, isLoading: isDeleting } = useDeleteVersion();

    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete
    } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const status = useMemo(() => {
        if (version.default) {
            return <Badge colorScheme="green" variant={"outline"}>Default</Badge>;
        }
        if (version.local) {
            return <Text >Installed</Text>;
        }
    }, [version]);

    return (
        <>
            <Tr>
                <Td>
                    {status}
                </Td>
                <Td>
                    <Flex gap={3}>
                        <Text fontSize='lg'>{version.id}</Text>
                        {
                            version.codename && <Badge variant={"subtle"}>LTS: {version.codename}</Badge>
                        }
                        {
                            version.latestLTS && <Badge colorScheme="teal" variant={"subtle"}>Latest</Badge>
                        }
                    </Flex>
                </Td>
                <Td>
                    <Flex gap={3} justifyContent='flex-end'>
                        {
                            !version.default && version.local && <Button
                                variant={"outline"}
                                size='md'
                                onClick={() => setCurrentVersion(version.id)}>
                                Use
                            </Button>
                        }

                        {
                            !version.local && <Button
                                variant={"outline"}
                                size='md'
                                isLoading={isInstalling}
                                onClick={() => install(version)}>
                                Install
                            </Button>
                        }

                        {
                            version.local && <Button
                                variant={"ghost"}
                                colorScheme={"red"}
                                size='md'
                                isLoading={isDeleting}
                                onClick={() => onOpenDelete()}>
                                Delete
                            </Button>
                        }
                    </Flex>
                </Td>
            </Tr>



            <AlertDialog
                isOpen={isOpenDelete}
                leastDestructiveRef={cancelRef}
                onClose={onCloseDelete}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Version
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete version {version.id}?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseDelete}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={() => {
                                onCloseDelete();
                                deleteVersion(version);
                            }} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};