def explicar_if() -> None:
    print("\n--- Exemplo com if ---")
    print("Código analisado:")
    print("idade = 18")
    print("if idade >= 18:")
    print('    print("Maior de idade")')

    print("\nPasso a passo:")
    print("1. A variável 'idade' recebe o valor 18.")
    print("2. O sistema verifica se idade >= 18.")
    print("3. Como 18 >= 18 é verdadeiro, o bloco do if será executado.")
    print('4. Resultado exibido: "Maior de idade"')
    input("\nPressione ENTER para voltar ao menu...")


def explicar_if_else() -> None:
    print("\n--- Exemplo com if/else ---")
    print("Código analisado:")
    print("nota = 6")
    print("if nota >= 7:")
    print('    print("Aprovado")')
    print("else:")
    print('    print("Reprovado")')

    print("\nPasso a passo:")
    print("1. A variável 'nota' recebe o valor 6.")
    print("2. O sistema verifica se nota >= 7.")
    print("3. Como 6 >= 7 é falso, o bloco do if não será executado.")
    print("4. O programa segue para o else.")
    print('5. Resultado exibido: "Reprovado"')
    input("\nPressione ENTER para voltar ao menu...")


def explicar_for() -> None:
    print("\n--- Exemplo com for ---")
    print("Código analisado:")
    print("for i in range(3):")
    print("    print(i)")

    print("\nPasso a passo:")
    print("1. O range(3) gera os valores 0, 1 e 2.")
    print("2. A variável 'i' assume um valor por vez.")
    print("3. A cada repetição, o valor atual de 'i' é exibido.")
    print("4. Saída final:")
    print("0")
    print("1")
    print("2")
    input("\nPressione ENTER para voltar ao menu...")


def explicar_while() -> None:
    print("\n--- Exemplo com while ---")
    print("Código analisado:")
    print("contador = 0")
    print("while contador < 3:")
    print("    print(contador)")
    print("    contador += 1")

    print("\nPasso a passo:")
    print("1. A variável 'contador' começa com valor 0.")
    print("2. O sistema verifica se contador < 3.")
    print("3. Enquanto a condição for verdadeira, o laço continua.")
    print("4. A cada repetição, o valor de contador é exibido e depois incrementado.")
    print("5. Saída final:")
    print("0")
    print("1")
    print("2")
    input("\nPressione ENTER para voltar ao menu...")