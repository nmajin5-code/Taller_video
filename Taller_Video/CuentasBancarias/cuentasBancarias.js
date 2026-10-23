class CuentaBancaria {
    #numero;
    #titular;
    #saldo;

    constructor(numero, titular, saldo) {
        if (!numero.trim() || !titular.trim()) {
            throw new Error("Complete todos los datos.");
        }

        if (!Number.isFinite(saldo) || saldo < 0) {
            throw new Error("El saldo no puede ser negativo.");
        }

        this.#numero = numero.trim();
        this.#titular = titular.trim();
        this.#saldo = saldo;
    }

    get numero() {
        return this.#numero;
    }

    get titular() {
        return this.#titular;
    }

    get saldo() {
        return this.#saldo;
    }

    consignar(monto) {
        if (!Number.isFinite(monto) || monto <= 0) {
            throw new Error("Ingrese un valor mayor que cero.");
        }

        this.#saldo += monto;
    }

    puedeRetirar(monto) {
        return monto <= this.#saldo;
    }

    retirar(monto) {
        if (!Number.isFinite(monto) || monto <= 0) {
            throw new Error("El retiro debe ser mayor que cero.");
        }

        if (!this.puedeRetirar(monto)) {
            throw new Error("No tiene saldo suficiente.");
        }

        this.#saldo -= monto;
    }
}

class CuentaAhorros extends CuentaBancaria {
    puedeRetirar(monto) {
        return monto <= this.saldo;
    }
}

class CuentaCorriente extends CuentaBancaria {
    #sobregiro = 100000;

    puedeRetirar(monto) {
        return monto <= this.saldo + this.#sobregiro;
    }
}

const cuentas = [];

function registrarCuenta() {
    try {
        let numero = document.getElementById("numero").value;
        let titular = document.getElementById("titular").value;
        let tipo = document.getElementById("tipo").value;
        let saldoTexto = document.getElementById("saldo").value;

        if (saldoTexto.trim() === "") {
            throw new Error("Ingrese el saldo inicial.");
        }

        let saldo = Number(saldoTexto);
        let cuenta;

        if (tipo === "ahorros") {
            cuenta = new CuentaAhorros(numero, titular, saldo);
        } else {
            cuenta = new CuentaCorriente(numero, titular, saldo);
        }

        let repetida = cuentas.some(c => c.numero === cuenta.numero);

        if (repetida) {
            throw new Error("Esta cuenta ya existe.");
        }

        cuentas.push(cuenta);

        document.getElementById("numero").value = "";
        document.getElementById("titular").value = "";
        document.getElementById("saldo").value = "";

        mostrarCuentas();
        mostrarMensaje("Cuenta registrada correctamente.");
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function consignar() {
    try {
        let cuenta = buscarCuenta();
        let montoTexto = document.getElementById("monto").value;

        if (montoTexto.trim() === "") {
            throw new Error("Ingrese el valor a consignar.");
        }

        cuenta.consignar(Number(montoTexto));
        mostrarCuentas();
        mostrarMensaje("Consignacion realizada correctamente.");
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function retirar() {
    try {
        let cuenta = buscarCuenta();
        let montoTexto = document.getElementById("monto").value;

        if (montoTexto.trim() === "") {
            throw new Error("Ingrese el valor a retirar.");
        }

        cuenta.retirar(Number(montoTexto));
        mostrarCuentas();
        mostrarMensaje("Retiro realizado correctamente.");
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function consultar() {
    try {
        let cuenta = buscarCuenta();

        mostrarMensaje(
            "Titular: " + cuenta.titular +
            " | Saldo: $" + cuenta.saldo
        );
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function buscarCuenta() {
    let numero = document.getElementById("cuenta").value;

    let cuenta = cuentas.find(c => c.numero === numero);

    if (!cuenta) {
        throw new Error("Seleccione una cuenta valida.");
    }

    return cuenta;
}

function mostrarCuentas() {
    let tabla = document.getElementById("tabla");
    let selector = document.getElementById("cuenta");

    tabla.innerHTML = "";
    selector.innerHTML = "";

    cuentas.forEach(cuenta => {
        let fila = tabla.insertRow();

        fila.insertCell().textContent = cuenta.numero;
        fila.insertCell().textContent = cuenta.titular;

        fila.insertCell().textContent =
            cuenta instanceof CuentaAhorros ? "Ahorros" : "Corriente";

        fila.insertCell().textContent = "$" + cuenta.saldo;

        let opcion = document.createElement("option");
        opcion.value = cuenta.numero;
        opcion.textContent = cuenta.numero + " - " + cuenta.titular;

        selector.appendChild(opcion);
    });
}

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

mostrarCuentas();
