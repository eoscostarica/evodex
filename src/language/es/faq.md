# Preguntas Frecuentes

## ¿Qué es Evodex?

Evodex es una plataforma de intercambio descentralizado que permite operar tokens sobre la cadena de bloques EOS, incluidos los tokens envueltos provenientes de otras cadenas de bloques, como pBTC. La liquidez para la creación de mercado la proporcionan los usuarios que transfieren sus fondos a pooles de liquidez (también denominados grupos de liquidez) a cambio de tarifas que pueden ser votadas por los proveedores de liquidez de cada

## ¿En qué es único Evodex?

La funcionalidad que distingue a Evodex es la capacidad otorgada a los proveedores de liquidez de votar por las tarifas que quieren cobrar. Esto se hace mediante un contrato inteligente que calcula el peso de cada votante en proporción a la participación que tiene en el pool.

Otra diferencia entre Evodex y otras plataformas proviene de las diferentes cadenas de bloques donde operan. Los usuarios solo pagan tarifas a los proveedores de liquidez, pero no tienen que pagar comisiones de transferencia como en Ethereum y otras redes.

## ¿Qué son los evotokens?

Para cada par registrado, habrá un token estándar respaldado por los activos del grupo de liquidez correspondiente. Estos nuevos tokens se pueden transferir libremente, facilitando el acceso y la gestión de la posición de inversión. Los denominamos "evotokens".

Cada par tiene un valor de tarifa asociado que puede variar entre 0,1% y 1%. El valor de los evotokens aumenta a medida que se recaudan las comisiones.

## ¿Cómo puedo aportar liquidez al pool?

Puede ir a la sección "liquidez" para agregar o retirar liquidez. Debe tener la misma cantidad (en valor) de ambos tokens del grupo para proporcionar liquidez. Al proporcionar liquidez, debe pagar una pequeña tarifa de 0,01%, que quedará en el pool correspondiente. Esto se hace para evitar un ataque fugaz en el que alguien agrega liquidez, modifica la tarifa al mínimo, realiza una operación de cambio y luego retira la liquidez, todo en la misma transacción. No hay comisión para retirar liquidez.

## ¿Cómo puedo votar la tarifa de un pool de liquidez?

Una vez que haya proporcionado liquidez a un pool, tiene derecho a votar sobre la tarifa que pagarán los futuros clientes. Para votar, vaya a la pestaña "Votar" y seleccione cualquier valor entre 0,1% y 1%. El contrato ingresará su voto ponderado según su participación en el pool, y actualizará la tarifa a la mediana ponderada de todos
los votos ingresados.

## ¿Puedo crear mi propio pool de liquidez?

La creación de pares en el contrato evolutiondex no es libre, pero nos proponemos que  sea parte de un futuro gobierno descentralizado. Los códigos de los contratos son públicos:
[GitHub de Evolution Dex](https://github.com/eosargentina/evolutiondex).

## ¿Puedo retirar mis tokens en cualquier momento?

Sí, puedes retirar tus tokens en cualquier momento vendiendo tus evotokens en la pestaña de liquidez.

## ¿Por qué cambia el precio con cantidades mayores?

El precio de un intercambio de tokens está determinado por los saldos del grupo. Si la liquidez es baja en comparación con la cantidad que desea intercambiar, puede sufrir un deslizamiento considerable en el precio.