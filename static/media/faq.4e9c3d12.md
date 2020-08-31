# Preguntas Frecuentes

## ¿Qué es evodex?

Evodex es una plataforma de intercambio descentralizado que permite transacciones entre cualquier token compatible con EOSio, incluidos los tokens envueltos en cadenas cruzadas como pBTC. La liquidez para la creación de mercado la proporcionan los usuarios que transfieren sus fondos a piscinas de liquidez (también denominados grupos de liquidez) a cambio de tarifas que pueden ser votadas por todos los proveedores de liquidez.

## ¿En qué es único evodex?

La principal característica nueva introducida por evodex es que los proveedores de liquidez pueden votar por las tarifas que quieren cobrar, esto se hace mediante un contrato inteligente que calcula el peso de cada votante en proporción a la participación que tienen en el grupo.

Otra diferencia entre evodex y otras plataformas proviene de las diferentes cadenas de bloques donde operan, los comerciantes solo pagan tarifas a los proveedores de liquidez, pero no tienen que pagar tarifas de transferencia como en Ethereum y otras redes.

## ¿Qué son los Evotokens?

Para cada par registrado, habrá un token estándar respaldado por los activos de las piscinas de liquidez correspondientes. Estos nuevos tokens se pueden transferir libremente, facilitando el acceso y la gestión de la posición de inversión. Estos tokens se denominan "evotokens".

Cada par comercial tiene un valor de tarifa asociado que puede ser variable. El valor de los evotokens aumenta a medida que se cobran las tarifas del intercambio y la adición de operaciones de liquidez. La acción de retirar liquidez (venta de evotokens) es gratuita.

## ¿Cómo puedo aportar liquidez al pool?

Puede ir a la sección "Liquidez" para agregar o eliminar liquidez. Debe tener la misma cantidad (en valor) de ambos tokens del grupo para proporcionar liquidez. Al proporcionar liquidez, debe pagar la tarifa correspondiente, esto se hace para evitar un ataque repentino de que alguien se una a un grupo de liquidez, cambiaría la tarifa y luego salga rápidamente. Eliminar la liquidez no tiene comisiones.

## ¿Cómo puedo votar la tarifa de una pisicina de liquidez?

Una vez que haya proporcionado liquidez a un grupo, tiene derecho a votar sobre la tarifa que pagan los futuros comerciantes y proveedores de liquidez. Para votar, vaya a la pestaña "Votar" y seleccione cualquier valor desde 0.01% hasta un máximo del 3%, el contrato promediará su voto en función del porcentaje que posee del grupo y actualizará la tarifa en consecuencia.

## ¿Puedo crear mi propio par comercial?

La creación de pares comerciales aún no es compatible con nuestro front-end, sin embargo, el protocolo está abierto y cualquiera puede crear un par comercial invocando el contrato inteligente "evolutiondex". Se puede encontrar más información en el [GitHub de Evolution Dex](https://github.com/eosargentina/evolutiondex).

## ¿Puedo retirar mis tokens en cualquier momento?

Sí, puedes retirar tus tokens en cualquier momento vendiendo tus evotokens en la pestaña de liquidez.

## ¿Por qué cambia el precio con cantidades mayores?

El precio de un intercambio de tokens está determinado por los saldos del grupo. Si la liquidez es baja en comparación con la cantidad que desea intercambiar, puede sufrir un deslizamiento de precios.
