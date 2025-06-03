import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react'
import { FiEye, FiRefreshCcw, FiTrash2 } from 'react-icons/fi'

interface Request {
  id: number
  timestamp: string
  method: string
  url: string
  status: number
  headers: Record<string, string>
  body: any
  response: any
}

const Dashboard = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // Charger les requêtes du localStorage au démarrage
    const savedRequests = localStorage.getItem('requests')
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://resend-reminder.vercel.app/dashboard/api/requests')
      const data = await response.json()
      setRequests(data)
      // Sauvegarder dans le localStorage
      localStorage.setItem('requests', JSON.stringify(data))
    } catch (error) {
      console.error('Erreur lors de la récupération des requêtes:', error)
    }
  }

  const clearRequests = () => {
    setRequests([])
    localStorage.removeItem('requests')
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'green'
    if (status >= 400 && status < 500) return 'orange'
    if (status >= 500) return 'red'
    return 'gray'
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'green'
      case 'POST':
        return 'blue'
      case 'OPTIONS':
        return 'purple'
      default:
        return 'gray'
    }
  }

  const stats = {
    total: requests.length,
    success: requests.filter((r) => r.status >= 200 && r.status < 300).length,
    error: requests.filter((r) => r.status >= 400).length,
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <HStack w="full" justify="space-between">
            <Heading
              fontSize={{ base: '2xl', md: '4xl' }}
              bgGradient="linear(to-r, brand.primary, brand.secondary)"
              bgClip="text"
            >
              Tableau de Bord
            </Heading>
            <HStack>
              <Button
                leftIcon={<FiRefreshCcw />}
                onClick={fetchRequests}
                bg="whiteAlpha.100"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Actualiser
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                onClick={clearRequests}
                bg="red.500"
                _hover={{ bg: 'red.600' }}
              >
                Effacer
              </Button>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            <Stat
              bg="rgba(255, 255, 255, 0.03)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <StatLabel color="gray.400">Total Requêtes</StatLabel>
              <StatNumber
                bgGradient="linear(to-r, brand.primary, brand.secondary)"
                bgClip="text"
                fontSize="3xl"
              >
                {stats.total}
              </StatNumber>
            </Stat>
            <Stat
              bg="rgba(255, 255, 255, 0.03)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <StatLabel color="gray.400">Succès</StatLabel>
              <StatNumber color="green.400" fontSize="3xl">
                {stats.success}
              </StatNumber>
            </Stat>
            <Stat
              bg="rgba(255, 255, 255, 0.03)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <StatLabel color="gray.400">Erreurs</StatLabel>
              <StatNumber color="red.400" fontSize="3xl">
                {stats.error}
              </StatNumber>
            </Stat>
          </SimpleGrid>

          <Box
            w="full"
            bg="rgba(255, 255, 255, 0.03)"
            borderRadius="xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Méthode</Th>
                  <Th>URL</Th>
                  <Th>Statut</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {requests.map((request) => (
                  <Tr key={request.id}>
                    <Td>
                      <Badge colorScheme={getMethodColor(request.method)}>{request.method}</Badge>
                    </Td>
                    <Td>
                      <Text isTruncated maxW="300px">
                        {request.url}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(request.status)}>
                        {request.status || 'En attente'}
                      </Badge>
                    </Td>
                    <Td>{new Date(request.timestamp).toLocaleString('fr-FR')}</Td>
                    <Td>
                      <IconButton
                        aria-label="Voir les détails"
                        icon={<FiEye />}
                        variant="ghost"
                        onClick={() => {
                          setSelectedRequest(request)
                          onOpen()
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalHeader
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Détails de la Requête
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="brand.primary" mb={1}>
                    En-têtes
                  </Text>
                  <Box
                    bg="whiteAlpha.50"
                    p={3}
                    borderRadius="md"
                    fontFamily="mono"
                    fontSize="sm"
                  >
                    <pre>{JSON.stringify(selectedRequest.headers, null, 2)}</pre>
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="brand.primary" mb={1}>
                    Corps de la requête
                  </Text>
                  <Box
                    bg="whiteAlpha.50"
                    p={3}
                    borderRadius="md"
                    fontFamily="mono"
                    fontSize="sm"
                  >
                    <pre>{JSON.stringify(selectedRequest.body, null, 2)}</pre>
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="brand.primary" mb={1}>
                    Réponse
                  </Text>
                  <Box
                    bg="whiteAlpha.50"
                    p={3}
                    borderRadius="md"
                    fontFamily="mono"
                    fontSize="sm"
                  >
                    <pre>{JSON.stringify(selectedRequest.response, null, 2)}</pre>
                  </Box>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Dashboard 