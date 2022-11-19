import itertools as its

def run_numonly(length, filename):
    global words
    words = "1234567890qwertyuiopasdfghjklzxcvbnm"
    r     = its.product(words, repeat=length)
    dic   = open(filename, 'a')
    for i in r:
        dic.write("".join(i))
        dic.write("".join("\n"))
    dic.close()

if __name__ == "__main__":
    run_numonly(8, "password.txt")
