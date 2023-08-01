import {program} from 'commander'

// defino la opcion que quiero pasar por parametro en consola
program.option('-m, --mode <mode>', 'Define el modo de ejecucion', 'dev').parse()

// En el package.json estan definidos dos scripts para entrar a desarrollo o a produccion 'npm run dev' y 'npm run prod' respectivamente

export const options = program.opts()