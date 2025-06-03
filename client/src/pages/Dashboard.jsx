import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  useToast,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
} from '@chakra-ui/react'
import { FiMail, FiCheck, FiX, FiClock, FiArrowLeft } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState([])
  const toast = useToast()

  useEffect(() => {
    // Charger les requêtes depuis le localStorage au montage
    const savedRequests = localStorage.getItem('emailRequests')
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const newRequest = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending',
    }

    try {
      const response = await axios.post('/api/send', formData)
      
      newRequest.status = response.data.success ? 'success' : 'error'
      newRequest.message = response.data.message

      toast({
        title: response.data.success ? 'Email envoyé !' : 'Erreur',
        description: response.data.message,
        status: response.data.success ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      })

      // Mettre à jour les requêtes et sauvegarder dans localStorage
      const updatedRequests = [newRequest, ...requests]
      setRequests(updatedRequests)
      localStorage.setItem('emailRequests', JSON.stringify(updatedRequests))

      if (response.data.success) {
        setFormData({
          to: '',
          subject: '',
          message: '',
        })
      }
    } catch (error) {
      newRequest.status = 'error'
      newRequest.message = error.response?.data?.message || 'Erreur lors de l\'envoi'
      
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Une erreur est survenue',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      const updatedRequests = [newRequest, ...requests]
      setRequests(updatedRequests)
      localStorage.setItem('emailRequests', JSON.stringify(updatedRequests))
    }

    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'green'
      case 'error':
        return 'red'
      default:
        return 'yellow'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return FiCheck
      case 'error':
        return FiX
      default:
        return FiClock
    }
  }

  const successCount = requests.filter((req) => req.status === 'success').length
  const errorCount = requests.filter((req) => req.status === 'error').length
  const totalCount = requests.length

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white' }}
            >
              Retour
            </Button>
            <Heading
              bgGradient="linear(to-r, brand.primary, brand.secondary)"
              bgClip="text"
            >
              Dashboard NoRize
            </Heading>
            <Box w={20} /> {/* Spacer pour centrer le titre */}
          </HStack>

          {/* Stats */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <Stat
              bg="rgba(255, 255, 255, 0.03)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <StatLabel color="gray.400">Total des Envois</StatLabel>
              <StatNumber
                fontSize="3xl"
                bgGradient="linear(to-r, brand.primary, brand.secondary)"
                bgClip="text"
              >
                {totalCount}
              </StatNumber>
              <StatHelpText>Depuis le début</StatHelpText>
            </Stat>
            <Stat
              bg="rgba(255, 255, 255, 0.03)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <StatLabel color="gray.400">Envois Réussis</StatLabel>
              <StatNumber color="green.400" fontSize="3xl">
                {successCount}
              </StatNumber>
              <StatHelpText>
                {totalCount > 0
                  ? `${Math.round((successCount / totalCount) * 100)}% de réussite`
                  : 'Aucun envoi'}
              </StatHelpText>
            </Stat>
            <Stat
              bg="rgba(255, 255, 255, 0.03)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <StatLabel color="gray.400">Erreurs</StatLabel>
              <StatNumber color="red.400" fontSize="3xl">
                {errorCount}
              </StatNumber>
              <StatHelpText>
                {totalCount > 0
                  ? `${Math.round((errorCount / totalCount) * 100)}% d'échec`
                  : 'Aucune erreur'}
              </StatHelpText>
            </Stat>
          </Grid>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="rgba(255, 255, 255, 0.03)"
            p={8}
            borderRadius="2xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
          >
            <VStack spacing={6}>
              <Heading size="md" alignSelf="start">
                Nouvel Email
              </Heading>
              <Input
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="Adresse email du destinataire"
                bg="rgba(0, 0, 0, 0.2)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                _focus={{
                  borderColor: 'brand.primary',
                  boxShadow: '0 0 0 1px #00F5A0',
                }}
              />
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Sujet de l'email"
                bg="rgba(0, 0, 0, 0.2)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                _focus={{
                  borderColor: 'brand.primary',
                  boxShadow: '0 0 0 1px #00F5A0',
                }}
              />
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Contenu de l'email"
                minH="200px"
                bg="rgba(0, 0, 0, 0.2)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                _focus={{
                  borderColor: 'brand.primary',
                  boxShadow: '0 0 0 1px #00F5A0',
                }}
              />
              <Button
                type="submit"
                isLoading={loading}
                bg="linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)"
                color="black"
                leftIcon={<FiMail />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 245, 160, 0.3)',
                }}
                alignSelf="start"
              >
                Envoyer
              </Button>
            </VStack>
          </Box>

          {/* Request History */}
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            p={8}
            borderRadius="2xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
            overflowX="auto"
          >
            <Heading size="md" mb={6}>
              Historique des Envois
            </Heading>
            {requests.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Destinataire</Th>
                    <Th>Sujet</Th>
                    <Th>Statut</Th>
                    <Th>Message</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((request, index) => (
                    <Tr key={index}>
                      <Td>
                        {new Date(request.timestamp).toLocaleString('fr-FR')}
                      </Td>
                      <Td>{request.to}</Td>
                      <Td>{request.subject}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <Icon
                            as={getStatusIcon(request.status)}
                            color={`${getStatusColor(request.status)}.400`}
                          />
                          <Badge colorScheme={getStatusColor(request.status)}>
                            {request.status === 'success'
                              ? 'Succès'
                              : request.status === 'error'
                              ? 'Erreur'
                              : 'En cours'}
                          </Badge>
                        </Flex>
                      </Td>
                      <Td>{request.message}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.400" textAlign="center">
                Aucun email envoyé pour le moment
              </Text>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Dashboard 