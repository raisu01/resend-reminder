import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Flex,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { FiMail, FiCheckCircle, FiBarChart2, FiArrowRight } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const Feature = ({ title, description, icon }) => {
  return (
    <VStack
      align="start"
      bg="rgba(255, 255, 255, 0.03)"
      p={6}
      borderRadius="xl"
      border="1px solid rgba(255, 255, 255, 0.1)"
      _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
      cursor="pointer"
    >
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        borderRadius="full"
        bg="linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)"
        mb={4}
      >
        <Icon as={icon} w={6} h={6} color="black" />
      </Flex>
      <Heading size="md" mb={2} bgGradient="linear(to-r, brand.primary, brand.secondary)" bgClip="text">
        {title}
      </Heading>
      <Text color="gray.400">{description}</Text>
    </VStack>
  )
}

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired
}

const Home = () => {
  return (
    <Box minH="100vh" py={20}>
      <Container maxW="container.xl">
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={20}>
          <Box
            w={20}
            h={20}
            bg="linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={4}
          >
            <Text fontSize="4xl" fontWeight="bold" color="black">
              N
            </Text>
          </Box>
          <Heading
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            NoRize Reminder
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.400" maxW="2xl">
            Une solution élégante pour l'envoi automatisé d'emails avec un suivi en temps réel et une interface moderne.
          </Text>
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/dashboard"
              size="lg"
              bg="linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)"
              color="black"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 245, 160, 0.3)',
              }}
              rightIcon={<FiArrowRight />}
            >
              Accéder au Dashboard
            </Button>
          </HStack>
        </VStack>

        {/* Features Section */}
        <VStack spacing={16}>
          <Heading
            fontSize={{ base: '2xl', md: '4xl' }}
            textAlign="center"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Fonctionnalités Principales
          </Heading>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={8}
            w="full"
            justify="center"
          >
            <Feature
              icon={FiMail}
              title="Emails Responsifs"
              description="Templates d'emails optimisés pour tous les appareils et clients de messagerie."
            />
            <Feature
              icon={FiCheckCircle}
              title="Suivi en Temps Réel"
              description="Visualisez l'état de vos envois et les statistiques en direct."
            />
            <Feature
              icon={FiBarChart2}
              title="Analyses Détaillées"
              description="Tableaux de bord complets avec historique et métriques de performance."
            />
          </Flex>
        </VStack>

        {/* How it Works Section */}
        <VStack spacing={12} mt={20}>
          <Heading
            fontSize={{ base: '2xl', md: '4xl' }}
            textAlign="center"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Comment ça marche ?
          </Heading>
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            p={8}
            borderRadius="2xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
            w="full"
            maxW="3xl"
            mx="auto"
          >
            <List spacing={6}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FiCheckCircle} color="brand.primary" w={6} h={6} />
                <VStack align="start" ml={4}>
                  <Text fontWeight="bold" color="brand.primary">
                    1. Configuration Simple
                  </Text>
                  <Text color="gray.400">
                    Intégrez l'API avec vos identifiants et commencez à envoyer des emails.
                  </Text>
                </VStack>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FiCheckCircle} color="brand.primary" w={6} h={6} />
                <VStack align="start" ml={4}>
                  <Text fontWeight="bold" color="brand.primary">
                    2. Envoi et Suivi
                  </Text>
                  <Text color="gray.400">
                    Envoyez vos emails et suivez leur statut en temps réel dans le dashboard.
                  </Text>
                </VStack>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FiCheckCircle} color="brand.primary" w={6} h={6} />
                <VStack align="start" ml={4}>
                  <Text fontWeight="bold" color="brand.primary">
                    3. Analyse des Résultats
                  </Text>
                  <Text color="gray.400">
                    Consultez les statistiques détaillées et optimisez vos campagnes.
                  </Text>
                </VStack>
              </ListItem>
            </List>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Home 